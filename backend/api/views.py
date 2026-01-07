from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Producto, Usuario
from .serializers import ProductoSerializer, UsuarioSerializer
import json

# Vistas para Productos
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])  # Cambia a [IsAuthenticated] si necesitas autenticación
def productos_list(request):
    """Lista todos los productos o crea uno nuevo"""
    if request.method == 'GET':
        productos = Producto.objects.filter(activo=True)
        serializer = ProductoSerializer(productos, many=True)
        return Response({
            'success': True,
            'count': productos.count(),
            'data': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Producto creado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def producto_detail(request, pk):
    """Obtiene, actualiza o elimina un producto específico"""
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Producto no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductoSerializer(producto)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = ProductoSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Producto actualizado',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        producto.delete()
        return Response({
            'success': True,
            'message': 'Producto eliminado'
        }, status=status.HTTP_204_NO_CONTENT)

# Vistas para Usuarios
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def usuarios_list(request):
    """Lista todos los usuarios o crea uno nuevo"""
    if request.method == 'GET':
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response({
            'success': True,
            'count': usuarios.count(),
            'data': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Usuario creado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# Vista de prueba simple para POST
@api_view(['POST'])
@permission_classes([AllowAny])
def crear_registro_simple(request):
    """Endpoint simple para crear registros (sin modelo)"""
    data = request.data
    
    # Validaciones simples
    if not data.get('nombre'):
        return Response({
            'success': False,
            'error': 'El nombre es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not data.get('email'):
        return Response({
            'success': False,
            'error': 'El email es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    

    try:
        # Guardar en el modelo Usuario
        usuario = Usuario.objects.create(
            nombre=data['nombre'],
            email=data['email'],
            edad=data.get('edad', 0)  # Valor por defecto si no se envía
        )
        
        # Si también quieres crear un producto asociado
        if data.get('producto_nombre'):
            producto = Producto.objects.create(
                nombre=data['producto_nombre'],
                descripcion=data.get('producto_descripcion', ''),
                precio=data.get('producto_precio', 0),
                stock=data.get('producto_stock', 0)
            )
            
            return Response({
                'success': True,
                'message': 'Usuario y Producto creados exitosamente',
                'data': {
                    'usuario': {
                        'id': usuario.id,
                        'nombre': usuario.nombre,
                        'email': usuario.email,
                        'edad': usuario.edad,
                        'fecha_registro': usuario.fecha_registro
                    },
                    'producto': {
                        'id': producto.id,
                        'nombre': producto.nombre,
                        'precio': producto.precio,
                        'stock': producto.stock
                    }
                }
            }, status=status.HTTP_201_CREATED)
        
        # Si solo se creó usuario
        return Response({
            'success': True,
            'message': 'Usuario creado exitosamente',
            'data': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email,
                'edad': usuario.edad,
                'fecha_registro': usuario.fecha_registro
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error al crear registro: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)