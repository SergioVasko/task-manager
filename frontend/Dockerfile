FROM node:20

WORKDIR /app

# Enable Corepack and install Yarn 4.9.2 globally
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Copy package.json and yarn.lock early for better Docker cache
COPY package.json yarn.lock ./

# Use node_modules linker (instead of PnP)
RUN echo "nodeLinker: node-modules" > .yarnrc.yml && yarn install

# Copy the rest of the source code
COPY . .

# Expose and start the React app
EXPOSE 3000
CMD ["yarn", "start"]
