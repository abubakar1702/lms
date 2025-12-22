from rest_framework import serializers
from .models import Category, Course
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True, required=False)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'course_count', 'created_at']
        read_only_fields = ['slug']

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.ReadOnlyField(source='instructor.get_full_name')
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Course
        fields = [
            'id', 'instructor', 'instructor_name', 'category', 'category_name',
            'title', 'slug', 'description', 'thumbnail', 'price', 
            'duration', 'is_published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'instructor']

    def create(self, validated_data):
        return super().create(validated_data)
