from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ClinicalCaseViewSet,
    DoctorProfileViewSet,
    NotificationViewSet,
    RegisterView,
)
from .views import MeView

router = DefaultRouter()
router.register(r'cases', ClinicalCaseViewSet)
router.register(r'doctors', DoctorProfileViewSet)
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = router.urls

urlpatterns += [
    path('register/', RegisterView.as_view(), name='register'),
    path("me/", MeView.as_view()),
]
