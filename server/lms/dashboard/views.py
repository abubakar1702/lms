from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum
from users.models import User
from courses.models import Course, Category
from enrollments.models import Enrollment

class AdminDashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Forbidden"}, status=403)

        role_wise_count = User.objects.values('role').annotate(count=Count('role'))
        status_wise_enrollments = Enrollment.objects.values('status').annotate(count=Count('status'))

        recent_courses = Course.objects.select_related('instructor', 'category').order_by('-created_at')[:3]

        return Response({
            "stats": [
                {"label": "Total Users", "value": User.objects.count(), "type": "users"},
                {"label": "Active Courses", "value": Course.objects.count(), "type": "courses"},
                {"label": "Enrollments", "value": Enrollment.objects.count(), "type": "enrollments"},
                {"label": "Categories", "value": Category.objects.count(), "type": "categories"},
            ],
            "recent_items": [{
                "id": c.id,
                "title": c.title,
                "instructor": c.instructor.get_full_name() or c.instructor.username,
                "progress": 100,
                "category": c.category.name if c.category else "Uncategorized",
                "color": "from-blue-500 to-indigo-600"
            } for c in recent_courses]
        })

class InstructorDashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['instructor', 'admin']:
            return Response({"error": "Forbidden"}, status=403)

        instructor = request.user
        my_courses = Course.objects.filter(instructor=instructor)
        my_enrollments = Enrollment.objects.filter(course__instructor=instructor)
        
        return Response({
            "stats": [
                {"label": "My Courses", "value": my_courses.count(), "type": "courses"},
                {"label": "Total Students", "value": my_enrollments.values('student').distinct().count(), "type": "users"},
                {"label": "Enrollments", "value": my_enrollments.count(), "type": "enrollments"},
                {"label": "Avg. Progress", "value": f"{round(my_enrollments.aggregate(Sum('progress'))['progress__sum'] or 0 / (my_enrollments.count() or 1))}%", "type": "trend"},
            ],
            "recent_items": [{
                "id": c.id,
                "title": c.title,
                "instructor": "You",
                "progress": 0,
                "category": c.category.name if c.category else "Uncategorized",
                "color": "from-purple-500 to-pink-600"
            } for c in my_courses[:3]]
        })

class StudentDashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        my_enrollments = Enrollment.objects.filter(student=request.user).select_related('course', 'course__instructor', 'course__category')
        
        return Response({
            "stats": [
                {"label": "Enrolled", "value": my_enrollments.count(), "type": "courses"},
                {"label": "Active", "value": my_enrollments.filter(status='active').count(), "type": "enrollments"},
                {"label": "Completed", "value": my_enrollments.filter(status='completed').count(), "type": "completed"},
                {"label": "Avg. Progress", "value": f"{round(my_enrollments.aggregate(avg=Sum('progress'))['avg'] or 0)}%", "type": "trend"},
            ],
            "recent_items": [{
                "id": en.id,
                "title": en.course.title,
                "instructor": en.course.instructor.get_full_name() or en.course.instructor.username,
                "progress": en.progress,
                "category": en.course.category.name if en.course.category else "General",
                "color": "from-orange-500 to-rose-600"
            } for en in my_enrollments[:3]]
        })