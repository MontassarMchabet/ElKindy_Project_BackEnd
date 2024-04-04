FROM node:16-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 5000
<<<<<<< HEAD
CMD ["npm", "dev"]
=======
CMD ["npm", "dev"]
>>>>>>> 57346571ce7c252a51838f6821e94d0878c75a5e
