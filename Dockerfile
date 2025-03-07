# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package.json package-lock.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto (opcional, si agregas un servidor en el futuro)
EXPOSE 3000

# Comando para ejecutar el bot
CMD ["node", "index.js"]
