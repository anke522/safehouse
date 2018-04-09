FROM node

RUN mkdir -p /safehouse
ADD package.json /safehouse

WORKDIR /safehouse

RUN npm install

ADD . /safehouse/

CMD ./run.sh
