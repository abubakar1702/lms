from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Course, Lesson

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'course_count', 'created_at']
        read_only_fields = ['slug', 'created_at']
    
    def get_course_count(self, obj):
        return obj.courses.filter(is_published=True).count()


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'video_url', 'duration', 'order', 'is_preview', 'created_at']
        read_only_fields = ['created_at']


class CourseSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        write_only=True, 
        source='instructor'
    )
    category_name = serializers.CharField(source='category.name', read_only=True)
    lesson_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'instructor', 'instructor_id', 'category', 'category_name',
            'title', 'slug', 'description', 'thumbnail', 'price',
            'duration', 'level', 'requirements', 'what_will_you_learn',
            'is_published', 'lesson_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_lesson_count(self, obj):
        return obj.lessons.count()
    
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not instance.category:
            representation['category_name'] = None
        return representation


class CourseDetailSerializer(CourseSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['lessons']


class LessonCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'content', 'video_url', 'duration', 'order', 'is_preview']
    
    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Order cannot be negative.")
        return value