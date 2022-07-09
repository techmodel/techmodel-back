FROM node:14 AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm audit fix

COPY . .
RUN ./node_modules/.bin/tsc -p .
# RUN npx copyfiles src/**/*.json build/

# Clean container, without uncompiled files:
FROM node:14
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm audit fix

COPY --from=builder /usr/src/app/build ./build
EXPOSE 8080
CMD node ./build/src/server/run-server.js
