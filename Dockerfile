FROM node:10
COPY package*.json /backend/
WORKDIR /backend
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]