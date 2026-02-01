from django.db import models

class User(models.Model):
    """Modelo de ejemplo para usuarios"""
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    edad = models.IntegerField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=128)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)

    class Meta:
        db_table = 'auth_users'
        app_label = 'users'  
    
    def __str__(self):
        return self.nombre