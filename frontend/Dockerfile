# Usamos Node 22 como solicitaste
FROM node:22-alpine

WORKDIR /app

# Instalamos Angular CLI globalmente dentro del contenedor
RUN npm install -g @angular/cli@18.2.12

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el código fuente
COPY . .

# Exponemos el puerto por defecto de Angular
EXPOSE 4201

# Iniciamos la aplicación permitiendo acceso externo (host 0.0.0.0)
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4201", "--poll", "2000"]