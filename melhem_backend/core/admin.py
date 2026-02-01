from django.contrib import admin
from .models import DoctorProfile, ClinicalCase, CaseMedia, Notification

admin.site.register(DoctorProfile)
admin.site.register(ClinicalCase)
admin.site.register(CaseMedia)
admin.site.register(Notification)
