from django.contrib import admin
from .models import Category, Course, Lesson

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'category', 'price', 'is_published', 'created_at']
    list_filter = ['is_published', 'category', 'created_at', 'level']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'description']
    raw_id_fields = ['instructor']
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'is_preview', 'created_at']
    list_filter = ['course', 'is_preview']
    search_fields = ['title', 'content']
