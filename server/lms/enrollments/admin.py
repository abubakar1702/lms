from django.contrib import admin
from .models import Enrollment, CourseProgress

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'status', 'progress', 'enrolled_at']
    list_filter = ['status', 'enrolled_at', 'course']
    search_fields = ['student__email', 'course__title']
    raw_id_fields = ['student', 'course']

@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = ['enrollment', 'lesson', 'is_completed', 'completed_at']
    list_filter = ['is_completed', 'completed_at']
    raw_id_fields = ['enrollment', 'lesson']
