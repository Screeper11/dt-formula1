FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm install -g serve

CMD ["sh", "-c", "serve -s build -l \"$PORT\""]