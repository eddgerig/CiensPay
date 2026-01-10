from rest_framework import serializers
from .models import  User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nombre', 'email', 'edad', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']
    
    def validate_email(self, value):
        """Validación personalizada para email"""
        if not value:
            raise serializers.ValidationError("El email es requerido")
        return value
    
    def validate_edad(self, value):
        """Validación personalizada para edad"""
        if value < 0 or value > 150:
            raise serializers.ValidationError("La edad debe estar entre 0 y 150")
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("nombre", "email", "edad", "username", "password", "password2")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data.get("password") != data.get("password2"):
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden"})
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password2", None)

        username = validated_data.get("username")
        if not username:
            # si no  mandan username, se genera
            base = (validated_data.get("email") or validated_data.get("nombre") or "user").split("@")[0]
            username = base

            # asegurar unicidad
            original = username
            i = 1
            while User.objects.filter(username=username).exists():
                username = f"{original}{i}"
                i += 1

        validated_data["username"] = username
        validated_data["email"] = validated_data["email"].strip().lower()

        user = User(**validated_data)
        user.password = make_password(password)
        user.save()
        return user