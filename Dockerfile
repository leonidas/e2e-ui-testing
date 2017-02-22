FROM node:7

ENV APP_PATH /opt/app
ENV SERVER_PATH ${APP_PATH}/server

RUN mkdir -p $APP_PATH
RUN mkdir -p $SERVER_PATH

COPY package.json $APP_PATH/

WORKDIR $APP_PATH

RUN npm install

COPY config $APP_PATH/config
COPY server $APP_PATH/server

COPY wait-for-it.sh $APP_PATH

CMD ./wait-for-it.sh $POSTGRES_DB:$POSTGRES_PORT -- npm start
