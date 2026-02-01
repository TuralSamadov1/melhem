from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.contrib.auth.models import User

class EmailTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "Invalid credentials"}, status=401)

        serializer = self.get_serializer(
            data={"username": user.username, "password": password}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
