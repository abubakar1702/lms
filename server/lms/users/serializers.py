from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import UserProfile, PasswordResetOTP

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer to use email instead of username"""
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace username field with email field
        if 'username' in self.fields:
            del self.fields['username']
        self.fields['email'] = serializers.EmailField()

    def validate(self, attrs):
        # Get email and password from attrs
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError({
                'email': 'This field is required.',
                'password': 'This field is required.'
            })
        
        # Get user by email (since USERNAME_FIELD is 'email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('No active account found with the given credentials.')
        
        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError('No active account found with the given credentials.')
        
        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        # Generate tokens using parent method
        refresh = self.get_token(user)
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'student_id', 'enrollment_date', 'instructor_id', 'department',
            'specialization', 'years_of_experience', 'linkedin_url',
            'github_url', 'website_url', 'timezone', 'language_preference'
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone_number', 'profile_picture', 'bio',
            'date_of_birth', 'address', 'city', 'country', 'postal_code',
            'profile', 'is_email_verified'
        ]
        read_only_fields = ['id', 'email', 'role', 'is_email_verified']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES,
        default=User.STUDENT
    )
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password_confirm', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        role = validated_data.pop('role', User.STUDENT)
        
        validated_data['username'] = validated_data['email']
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.role = role
        user.save()
        
        UserProfile.objects.create(user=user)
        
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value


class PasswordResetVerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    
    def validate(self, attrs):
        email = attrs['email']
        otp = attrs['otp']
        
        try:
            user = User.objects.get(email=email)
            otp_obj = PasswordResetOTP.objects.filter(
                user=user,
                otp=otp,
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp_obj:
                raise serializers.ValidationError({"otp": "Invalid OTP."})
            
            if not otp_obj.is_valid():
                raise serializers.ValidationError({"otp": "OTP has expired. Please request a new one."})
            
            attrs['otp_obj'] = otp_obj
            return attrs
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User with this email does not exist."})


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        email = attrs['email']
        otp = attrs['otp']
        
        try:
            user = User.objects.get(email=email)
            otp_obj = PasswordResetOTP.objects.filter(
                user=user,
                otp=otp,
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp_obj:
                raise serializers.ValidationError({"otp": "Invalid OTP."})
            
            if not otp_obj.is_valid():
                raise serializers.ValidationError({"otp": "OTP has expired. Please request a new one."})
            
            attrs['otp_obj'] = otp_obj
            return attrs
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User with this email does not exist."})
