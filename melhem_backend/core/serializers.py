from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DoctorProfile, ClinicalCase, CaseMedia, Notification


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'is_staff']


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DoctorProfile
        fields = '__all__'


class CaseMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseMedia
        fields = '__all__'


class ClinicalCaseSerializer(serializers.ModelSerializer):
    media = CaseMediaSerializer(many=True, read_only=True)
    doctor = UserSerializer(read_only=True)

    class Meta:
        model = ClinicalCase
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
