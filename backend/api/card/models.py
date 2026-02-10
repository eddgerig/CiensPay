from django.db import models
import random

from api.models import BaseModel

class Card(BaseModel, models.Model):
    numero_tarjeta = models.CharField(max_length=100, unique=True)
    saldo = models.IntegerField()
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField(null=True, blank=True)
    
    # El campo booleano para el estado
    activo = models.BooleanField(default=False) 
    
    # La ForeignKey apuntando a tu modelo 'User' de la app 'users'
    # Usamos el string 'users.User' para evitar errores de importación
    user = models.ForeignKey(
        'users.User', 
        on_delete=models.CASCADE, 
        related_name='cards'
    )

    class Meta:
        db_table = 'cards'
        app_label = 'card'  
    
    def __str__(self):
        return f"Tarj: {self.numero_tarjeta} - Usuario: {self.user.full_name}"
    
    @staticmethod
    def validate_luhn(card_number):
        """
        Valida un número de tarjeta usando el algoritmo de Luhn
        """
        def luhn_checksum(card_num):
            def digits_of(n):
                return [int(d) for d in str(n)]
            
            digits = digits_of(card_num)
            odd_digits = digits[-1::-2]
            even_digits = digits[-2::-2]
            checksum = sum(odd_digits)
            for d in even_digits:
                checksum += sum(digits_of(d * 2))
            return checksum % 10
        
        return luhn_checksum(card_number) == 0
    
    @staticmethod
    def calculate_luhn_digit(partial_number):
        """
        Calcula el dígito de verificación Luhn para un número parcial
        """
        def digits_of(n):
            return [int(d) for d in str(n)]
        
        # Añadimos un 0 temporal al final
        digits = digits_of(partial_number) + [0]
        odd_digits = digits[-1::-2]
        even_digits = digits[-2::-2]
        checksum = sum(odd_digits)
        for d in even_digits:
            checksum += sum(digits_of(d * 2))
        
        # Calculamos qué dígito necesitamos para que checksum % 10 == 0
        return (10 - (checksum % 10)) % 10
    
    @classmethod
    def generate_card_number(cls):
        """
        Genera un número de tarjeta único de 16 dígitos con BIN 465100
        y validación Luhn
        """
        BIN = "465100"  # Bank Identification Number de CiensPay
        
        max_attempts = 1000
        for _ in range(max_attempts):
            # Generar 9 dígitos aleatorios (16 total - 6 BIN - 1 check digit)
            random_digits = ''.join([str(random.randint(0, 9)) for _ in range(9)])
            
            # Combinar BIN + dígitos aleatorios
            partial_number = BIN + random_digits
            
            # Calcular el dígito de verificación Luhn
            check_digit = cls.calculate_luhn_digit(partial_number)
            
            # Número completo de 16 dígitos
            full_number = partial_number + str(check_digit)
            
            # Verificar que sea único en la base de datos
            if not cls.objects.filter(numero_tarjeta=full_number).exists():
                return full_number
        
        raise Exception("No se pudo generar un número de tarjeta único después de múltiples intentos")