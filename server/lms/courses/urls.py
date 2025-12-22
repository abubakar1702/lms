from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CourseViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'list', CourseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
