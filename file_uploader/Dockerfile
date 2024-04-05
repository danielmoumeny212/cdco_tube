FROM node:18.17.0-alpine

WORKDIR /app

COPY package*.json . 

RUN npm install 

# Copie du reste des fichiers de l'application
COPY . .

# Commande par défaut pour démarrer l'application
CMD npm start

# Exposition du port sur lequel l'application écoute
EXPOSE 8080
