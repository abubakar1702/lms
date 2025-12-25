from django.contrib import admin
from .models import Category, Course, Lesson

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'order', 'duration', 'video_url', 'is_preview']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    readonly_fields = ['created_at']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'category', 'level', 'price', 'is_published', 'created_at']
    list_filter = ['is_published', 'category', 'instructor', 'level', 'created_at']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'description']
    raw_id_fields = ['instructor'] 
    readonly_fields = ['created_at', 'updated_at']
    inlines = [LessonInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'thumbnail')
        }),
        ('Course Details', {
            'fields': ('category', 'instructor', 'level', 'price', 'duration')
        }),
        ('Additional Information', {
            'fields': ('requirements', 'what_will_you_learn')
        }),
        ('Publishing', {
            'fields': ('is_published', 'created_at', 'updated_at')
        }),
    )

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'duration', 'is_preview', 'created_at']
    list_filter = ['course', 'is_preview', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['order', 'is_preview']