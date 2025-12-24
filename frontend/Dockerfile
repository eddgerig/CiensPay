FROM node:22-alpine

WORKDIR /app

# Asegura que los binarios locales estén en el PATH
ENV PATH /app/node_modules/.bin:$PATH
# Para que Create React App escuche en 0.0.0.0 y no intente abrir navegador
ENV HOST 0.0.0.0
ENV BROWSER none

# Copiamos package.json y package-lock.json e instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Puerto por defecto de CRA
EXPOSE 4201

# Comando de desarrollo
CMD ["npm", "start"]