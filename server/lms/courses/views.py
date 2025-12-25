from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count, Q
from django.utils import timezone

from .models import Category, Course, Lesson
from .serializers import CategorySerializer, CourseSerializer, CourseDetailSerializer, LessonSerializer
from enrollments.models import Enrollment, CourseProgress

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class IsInstructorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if getattr(request.user, 'role', None) == 'admin':
            return True
        return obj.instructor == request.user

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(course_count=Count('courses'))
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.all()
        category_slug = self.request.query_params.get('category', None)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        user = self.request.user

        if not user.is_authenticated:
            return queryset.filter(is_published=True)
        
        if getattr(user, 'role', None) == 'admin':
            return queryset
            
        return queryset.filter(Q(is_published=True) | Q(instructor=user))

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=False, methods=['GET'], permission_classes=[permissions.IsAuthenticated])
    def my_courses(self, request):
        courses = Course.objects.filter(instructor=request.user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_slug = self.request.query_params.get('course_slug', None)
        if course_slug:
            return self.queryset.filter(course__slug=course_slug)
        return self.queryset

    @action(detail=True, methods=['get'], url_path='progress')
    def progress(self, request, pk=None):
        lesson = self.get_object()
        enrollment = Enrollment.objects.filter(student=request.user, course=lesson.course).first()
        if not enrollment:
            return Response({"detail": "You are not enrolled in this course."}, status=status.HTTP_403_FORBIDDEN)
        
        progress = CourseProgress.objects.filter(enrollment=enrollment, lesson=lesson).first()
        return Response({"is_completed": bool(progress and progress.is_completed)})

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        lesson = self.get_object()
        enrollment = Enrollment.objects.filter(student=request.user, course=lesson.course).first()
        
        if not enrollment:
            return Response({"detail": "You are not enrolled in this course."}, status=status.HTTP_403_FORBIDDEN)
            
        progress, created = CourseProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
        
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
                
        return Response({
            "message": "Lesson marked as completed", 
            "course_progress": enrollment.progress
        })

    def perform_create(self, serializer):
        course_id = self.request.data.get('course')
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise PermissionDenied("Course not found.")

        is_instructor = (course.instructor == self.request.user)
        is_admin = (getattr(self.request.user, 'role', None) == 'admin')
        
        if not (is_instructor or is_admin):
            raise PermissionDenied("You are not the instructor of this course.")
            
        serializer.save()