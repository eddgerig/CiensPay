from django.db import models

class User(models.Model):
    """Modelo de ejemplo para usuarios"""
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    edad = models.IntegerField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'usuarios'
    
    def __str__(self):
        return self.nombre