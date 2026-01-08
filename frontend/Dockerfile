FROM node:18-alpine

WORKDIR /app

# Instalar xdg-utils si realmente necesitas abrir navegador (opcional)
# RUN apk add --no-cache xdg-utils

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]