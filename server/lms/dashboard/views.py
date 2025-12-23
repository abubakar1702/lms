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

        total_users = User.objects.count()
        role_wise_count = User.objects.values('role').annotate(count=Count('role'))
        
        total_courses = Course.objects.count()
        total_enrollments = Enrollment.objects.count()
        total_categories = Category.objects.count()
        
        # Enrollment status breakdown
        status_wise_enrollments = Enrollment.objects.values('status').annotate(count=Count('status'))
        
        return Response({
            "users": {
                "total": total_users,
                "role_breakdown": {item['role']: item['count'] for item in role_wise_count}
            },
            "courses": {
                "total": total_courses,
                "total_categories": total_categories
            },
            "enrollments": {
                "total": total_enrollments,
                "status_breakdown": {item['status']: item['count'] for item in status_wise_enrollments}
            }
        })

class InstructorDashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'instructor' and request.user.role != 'admin':
            return Response({"error": "Forbidden"}, status=403)

        # Handle Admin requesting instructor view (optional, but good for testing)
        instructor = request.user
        
        my_courses = Course.objects.filter(instructor=instructor)
        total_my_courses = my_courses.count()
        
        my_enrollments = Enrollment.objects.filter(course__instructor=instructor)
        total_students = my_enrollments.values('student').distinct().count()
        total_enrollments = my_enrollments.count()
        
        # Breakdown of my courses by category
        category_breakdown = my_courses.values('category__name').annotate(count=Count('id'))
        
        return Response({
            "courses": {
                "total": total_my_courses,
                "category_breakdown": {item['category__name'] or "Uncategorized": item['count'] for item in category_breakdown}
            },
            "students": {
                "total_unique": total_students,
                "total_enrollments": total_enrollments
            }
        })

class StudentDashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'student' and request.user.role != 'admin':
            return Response({"error": "Forbidden"}, status=403)

        my_enrollments = Enrollment.objects.filter(student=request.user)
        total_enrolled = my_enrollments.count()
        completed_courses = my_enrollments.filter(status='completed').count()
        active_courses = my_enrollments.filter(status='active').count()
        
        return Response({
            "enrolled_courses": total_enrolled,
            "active_courses": active_courses,
            "completed_courses": completed_courses,
            "average_progress": my_enrollments.aggregate(avg_progress=Sum('progress'))['avg_progress'] or 0
        })
