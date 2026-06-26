FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server bound to 0.0.0.0 so it is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]