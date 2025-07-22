FROM node:18

WORKDIR /

# Copy package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install yarn 3 in the container
RUN npm install -g yarn && yarn set version berry

# Optional: if you want node_modules instead of PnP
COPY .yarnrc.yml ./

# Install dependencies with yarn 3
RUN yarn install

# Copy the rest of the source code
COPY . .

# Expose and start the React app
EXPOSE 3000
CMD ["yarn", "start"]