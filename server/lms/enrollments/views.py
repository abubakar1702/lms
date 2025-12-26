from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Enrollment, CourseProgress
from .serializers import EnrollmentSerializer, CourseProgressSerializer
from courses.models import Course

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Enrollment.objects.all()
        elif user.role == 'instructor':
            return Enrollment.objects.filter(course__instructor=user)
        return Enrollment.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['POST'])
    def complete_lesson(self, request, pk=None):
        enrollment = self.get_object()
        lesson_id = request.data.get('lesson_id')
        
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        progress, created = CourseProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson_id=lesson_id
        )
        
        if not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
            total_lessons = enrollment.course.lessons.count()
            completed_lessons = enrollment.lesson_progress.filter(is_completed=True).count()
            if total_lessons > 0:
                enrollment.progress = (completed_lessons / total_lessons) * 100
                if enrollment.progress == 100:
                    enrollment.status = 'completed'
                    enrollment.completed_at = timezone.now()
                enrollment.save()

        return Response({"message": "Lesson marked as completed", "progress": enrollment.progress})
