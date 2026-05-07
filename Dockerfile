FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve@14
COPY --from=builder /app/build/client /app/public
EXPOSE 3000
CMD ["sh", "-c", "serve -s /app/public -l ${PORT:-3000}"]