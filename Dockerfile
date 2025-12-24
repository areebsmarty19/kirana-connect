# --- Stage 1: Build the React App ---
# We use Node.js to build the static files
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files to install dependencies first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code (App.tsx, components, etc.)
COPY . .

# Build the app (compiles TypeScript to HTML/CSS/JS)
# This usually creates a 'dist' or 'build' folder
RUN npm run build

# --- Stage 2: Serve the App with Nginx ---
# We use Nginx, a super fast web server, to show your site
FROM nginx:alpine

# Copy the built files from the previous stage to Nginx's public folder
# Note: If you use Vite, the folder is usually /app/dist
# If you use Create React App, it is usually /app/build
# I'm assuming Vite given the file structure; if it fails, change 'dist' to 'build' below.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a simple Nginx config to handle React routing (optional but recommended)
# (If you don't add this, refreshing a page might give a 404 error)
# For simplicity in this beginner guide, we stick to defaults for now.

# Expose port 80 (Standard web port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
