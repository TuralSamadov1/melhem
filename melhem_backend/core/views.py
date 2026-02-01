from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status

from .models import DoctorProfile, ClinicalCase, Notification
from .serializers import (
    DoctorProfileSerializer,
    ClinicalCaseSerializer,
    NotificationSerializer
)


class ClinicalCaseViewSet(viewsets.ModelViewSet):
    queryset = ClinicalCase.objects.all().order_by('-created_at')
    serializer_class = ClinicalCaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class DoctorProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class RegisterView(APIView):
    def post(self, request):
        data = request.data

        email = data.get('username')
        password = data.get('password')
        full_name = data.get('full_name', '')
        degree = data.get('degree', '')
        specialty = data.get('specialty', '')
        whatsapp = data.get('whatsapp', '')
        instagram = data.get('instagram', '')
        website = data.get('website', '')

        # Boş sahə yoxlaması
        if not email or not password or not full_name or not specialty or not whatsapp:
            return Response(
                {'error': 'Bütün sahələri doldurun (ad, email, parol, ixtisas, whatsapp)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Parol uzunluğu yoxlaması
        if len(password) < 6:
            return Response(
                {'error': 'Parol ən azı 6 simvol olmalıdır'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # E-poçt unikal olmalıdır
        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Bu e-poçt artıq qeydiyyatdan keçib'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Ad və soyadı ayır
            name_parts = full_name.strip().split()
            first_name = name_parts[0] if len(name_parts) > 0 else ''
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            DoctorProfile.objects.create(
                user=user,
                degree=degree,
                specialty=specialty,
                whatsapp=whatsapp,
                instagram=instagram,
                website=website
            )
        except Exception as e:
            return Response(
                {'error': f'Qeydiyyat zamanı sistem xətası: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {'message': 'Qeydiyyat uğurla tamamlandı'},
            status=status.HTTP_201_CREATED
        )

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.profile.role if hasattr(user, "profile") else None,
            "name": f"{user.first_name} {user.last_name}".strip()
        })