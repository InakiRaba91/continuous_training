# Use an official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React app source code to the container
COPY . .

# Expose ports 3000 and 3001 to the outside world
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]