# Usamos Node 22 como base
FROM node:22-alpine

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Vite usa por defecto el puerto 5173
EXPOSE 5173

# Iniciamos el servidor de desarrollo de Vite
# --host 0.0.0.0 es necesario para que Docker pueda mapear el puerto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]