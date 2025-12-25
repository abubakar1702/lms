from django.urls import path
from .views import (
    AdminDashboardSummaryView, 
    InstructorDashboardSummaryView, 
    StudentDashboardSummaryView
)

urlpatterns = [
    path('admin/', AdminDashboardSummaryView.as_view(), name='admin-dashboard'),
    path('instructor/', InstructorDashboardSummaryView.as_view(), name='instructor-dashboard'),
    path('student/', StudentDashboardSummaryView.as_view(), name='student-dashboard'),
]