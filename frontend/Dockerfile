FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm install -g serve

EXPOSE $PORT
CMD ["serve", "-s", "build", "-l", "localhost:$PORT"]