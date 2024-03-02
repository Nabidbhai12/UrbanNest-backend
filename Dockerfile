# Use the official Node.js 16 as a base image
FROM node:16-alpine

# Set the working directory for the app inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) to install dependencies
COPY package*.json ./
# After copying your package.json and before npm install
COPY .env ./


# Install production dependencies.
# Note: If you're using npm@7 or above, `npm ci` behaves differently with 'type="module"'.
# You might need to use `npm install --only=production` instead.
RUN npm install --only=production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app. This uses the "start" script from your package.json.
CMD ["npm", "start"]
