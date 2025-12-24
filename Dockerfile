# --- Stage 1: Build ---
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ⚠️ CHECK: If you use 'Create React App', this creates a 'build' folder.
# If you use 'Vite', this creates a 'dist' folder.
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine

# ⚠️ CHECK: Change '/app/dist' to '/app/build' if you are not using Vite.
COPY --from=builder /app/dist /usr/share/nginx/html

# --- THIS IS THE CRITICAL NEW LINE ---
# It replaces the default server config with your custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
