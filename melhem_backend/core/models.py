from django.db import models
from django.contrib.auth.models import User


class DoctorProfile(models.Model):
    DEGREE_CHOICES = [
        ('dr', 'Dr'),
        ('phd', 'PhD'),
        ('op_phd', 'Op.PhD'),
        ('uzman', 'Uzman'),
        ('prof', 'Prof'),
        ('dos', 'Dosent'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    degree = models.CharField(max_length=20, choices=DEGREE_CHOICES)
    specialty = models.CharField(max_length=255)
    whatsapp = models.CharField(max_length=20)
    instagram = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name()}"

class ClinicalCase(models.Model):
    STATUS_CHOICES = [
        ('new', 'Yeni'),
        ('in_progress', 'Hazırlanır'),
        ('published', 'Paylaşıldı'),
    ]

    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    problem = models.TextField()
    treatment = models.TextField()
    result = models.TextField()
    is_anonymous = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CaseMedia(models.Model):
    case = models.ForeignKey(ClinicalCase, related_name='media', on_delete=models.CASCADE)
    file = models.FileField(upload_to='cases/')
    is_video = models.BooleanField(default=False)

    def __str__(self):
        return f"Media for {self.case.title}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message
