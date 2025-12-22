from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from django.db.models import Count
from .models import Category, Course
from .serializers import CategorySerializer, CourseSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class IsInstructorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.instructor == request.user or request.user.role == 'admin'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(course_count=Count('courses'))
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price']

    def get_queryset(self):
        queryset = Course.objects.all()
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        if not self.request.user.is_authenticated:
            return queryset.filter(is_published=True)
        
        if self.request.user.role == 'student':
            return queryset.filter(is_published=True)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
