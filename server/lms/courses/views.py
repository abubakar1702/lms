from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from .models import Category, Course, Lesson
from .serializers import CategorySerializer, CourseSerializer, CourseDetailSerializer, LessonSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class IsInstructorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Admins can do anything
        if request.user.role == 'admin':
            return True
        # Instructors can only edit their own courses
        return obj.instructor == request.user and request.user.role == 'instructor'

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
        
        # Public users only see published courses
        if not user.is_authenticated:
            return queryset.filter(is_published=True)
        
        # Admins see everything
        if user.role == 'admin':
            return queryset
            
        # Instructors see published courses + their own courses
        if user.role == 'instructor':
            return queryset.filter(Q(is_published=True) | Q(instructor=user))
            
        # Students see only published courses
        return queryset.filter(is_published=True)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=False, methods=['GET'], permission_classes=[permissions.IsAuthenticated])
    def my_courses(self, request):
        if request.user.role == 'instructor':
            courses = Course.objects.filter(instructor=request.user)
        else:
            # This will be handled in enrollments app later, but for now return empty
            courses = Course.objects.none()
            
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

    def perform_create(self, serializer):
        # You would typically pass course_id in the request
        course_id = self.request.data.get('course')
        course = Course.objects.get(id=course_id)
        if course.instructor != self.request.user and self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You are not the instructor of this course.")
        serializer.save()
