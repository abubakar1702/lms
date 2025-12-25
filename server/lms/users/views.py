from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
import string

from .models import PasswordResetOTP, UserProfile
from .serializers import (
    UserSerializer, RegisterSerializer, 
    PasswordResetRequestSerializer, PasswordResetVerifyOTPSerializer,
    PasswordResetConfirmSerializer, CustomTokenObtainPairSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT view to use email for authentication"""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Create a copy of request.data to avoid mutating the original
        data = request.data.copy()
        profile_data = data.pop('profile', None)
        
        # Update user fields
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Update profile if provided
        if profile_data:
            from .serializers import UserProfileSerializer
            # Ensure profile exists
            profile_instance, created = UserProfile.objects.get_or_create(user=instance)
            profile_serializer = UserProfileSerializer(profile_instance, data=profile_data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()
        
        # Refresh and return updated data
        instance.refresh_from_db()
        return Response(self.get_serializer(instance).data)

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))


class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Invalidate any existing unused OTPs for this user
        PasswordResetOTP.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)
        
        # Generate new 6-digit OTP
        otp = generate_otp()
        expires_at = timezone.now() + timedelta(minutes=10)  # OTP expires in 10 minutes
        
        PasswordResetOTP.objects.create(
            user=user,
            otp=otp,
            expires_at=expires_at
        )
        
        # In production, send OTP via email/SMS
        # For now, we'll return it in the response (remove this in production!)
        print(f"OTP for {email}: {otp}")  # Remove in production
        
        return Response({
            "message": "OTP has been sent to your email.",
            "otp": otp  # Remove this in production - only for development
        }, status=status.HTTP_200_OK)


class PasswordResetVerifyOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetVerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        return Response({
            "message": "OTP verified successfully. You can now reset your password.",
            "verified": True
        }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        otp_obj = serializer.validated_data['otp_obj']
        user = otp_obj.user
        new_password = serializer.validated_data['new_password']
        
        # Reset password
        user.set_password(new_password)
        user.save()
        
        # Mark OTP as used
        otp_obj.mark_as_used()
        
        # Invalidate all other unused OTPs for this user
        PasswordResetOTP.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)
        
        return Response({
            "message": "Password has been reset successfully."
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
