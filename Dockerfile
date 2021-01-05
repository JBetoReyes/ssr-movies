FROM node:12

COPY [".", "/usr/src"]

WORKDIR "/usr/src"

RUN npm install

EXPOSE 3001

CMD ["npx", "nodemon", "index.js"]

