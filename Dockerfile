FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN yarn build
EXPOSE 4010
CMD ["node", "dist/index.js"]
