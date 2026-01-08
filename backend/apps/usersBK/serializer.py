from rest_framework import serializers
from .models import Producto, User


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