from rest_framework import serializers
from .models import Category, Course, Lesson

class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True, required=False)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'course_count', 'created_at']
        read_only_fields = ['slug']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'video_url', 'duration', 'order', 'is_preview']

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.ReadOnlyField(source='instructor.get_full_name')
    category_name = serializers.ReadOnlyField(source='category.name')
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'instructor', 'instructor_name', 'category', 'category_name',
            'title', 'slug', 'description', 'thumbnail', 'price', 
            'duration', 'level', 'requirements', 'what_will_you_learn',
            'is_published', 'lesson_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'instructor']

class CourseDetailSerializer(CourseSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['lessons']
