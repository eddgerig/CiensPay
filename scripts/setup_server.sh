#!/bin/bash

# Actualizar sistema
sudo apt-get update
sudo apt-get install -y nginx python3-pip python3-venv git acl

# Crear directorios
# Frontend
sudo mkdir -p /var/www/cienspay-frontend
sudo chown -R ubuntu:ubuntu /var/www/cienspay-frontend

# Backend
# Asumimos que el código vivirá en /home/ubuntu/cienspay-backend
mkdir -p /home/ubuntu/cienspay-backend

# Clonar repo (Opcional, si no se hace vía SCP)
# git clone https://github.com/eddgerig/CiensPay.git /home/ubuntu/CiensPay-Repo

# Crear Venv
cd /home/ubuntu/cienspay-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Configurar Permisos para www-data (Nginx)
sudo usermod -aG ubuntu www-data
sudo chmod 710 /home/ubuntu

# Instrucciones finales
echo "Setup básico completado."
echo "Ahora debes:"
echo "1. Copiar backend/cienspay-backend.service a /etc/systemd/system/"
echo "2. Copiar nginx/cienspay-native.conf a /etc/nginx/sites-available/"
echo "3. Habilitar ambos servicios."
