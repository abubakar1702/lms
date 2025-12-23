from rest_framework import serializers
from .models import Enrollment, CourseProgress
from courses.serializers import CourseSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    student_name = serializers.ReadOnlyField(source='student.get_full_name')
    student_email = serializers.ReadOnlyField(source='student.email')

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_name', 'student_email', 'course', 
            'course_details', 'status', 'enrolled_at', 'completed_at', 'progress'
        ]
        read_only_fields = ['student', 'enrolled_at', 'completed_at', 'progress']

    def validate(self, data):
        student = self.context['request'].user
        course = data['course']
        if Enrollment.objects.filter(student=student, course=course).exists():
            raise serializers.ValidationError("You are already enrolled in this course.")
        return data

class CourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseProgress
        fields = ['id', 'enrollment', 'lesson', 'is_completed', 'completed_at']
        read_only_fields = ['completed_at']
