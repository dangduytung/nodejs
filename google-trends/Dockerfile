# Use a Node.js base image
FROM node:16-slim AS base

FROM base as builder

# Set production environment
ENV NODE_ENV=production

# Set the timezone to Asia/Ho_Chi_Minh
ENV TZ=Asia/Ho_Chi_Minh

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build obfuscation use bytecode (generated `dist` folder)
# RUN npm run-script compile-ob         ### This command get error: Passed function cannot be serialized! when crawling
RUN npm run-script compile

# Stage 2: Creating the final lightweight image
FROM base as runner

WORKDIR /app

# Copy only necessary folders, files from the previous stage
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
# CMD ["node", "app/main.js"]
CMD ["node", "launcher.js"]