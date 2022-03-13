FROM node:16

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm ci \
    && printf "ls\n npm run start " > entrypoint.sh

COPY . .

EXPOSE 3000

CMD ["/bin/sh", "entrypoint.sh"]