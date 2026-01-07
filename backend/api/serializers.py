from rest_framework import serializers
from .models import Producto, Usuario

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'fecha_creacion', 'activo']
        read_only_fields = ['id', 'fecha_creacion']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
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