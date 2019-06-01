FROM alpine
LABEL maintainer="timvanellemeet@gmail.com"
RUN apk add --update nodejs nodejs-npm
COPY package*.json app/
COPY src app/src
WORKDIR app/
RUN npm install
EXPOSE 8081
ENTRYPOINT ["npm", "start"]
