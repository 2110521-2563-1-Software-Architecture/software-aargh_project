FROM node:10
COPY package*.json /backend/
WORKDIR /backend
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]