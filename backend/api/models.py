from django.db import models

class BaseModel(models.Model):
    """Clase base para que todas las tablas tengan auditoría automática"""
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última modificación")

    class Meta:
        abstract = True # IMPORTANTE: Indica que esto no crea una tabla propia

class Producto(models.Model):
    """Modelo de ejemplo para productos"""
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'productos'
    
    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    """Modelo de ejemplo para usuarios"""
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    edad = models.IntegerField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'usuarios'
    
    def __str__(self):
        return self.nombre