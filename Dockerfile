FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 4010
CMD ["node", "dist/index.js"]
