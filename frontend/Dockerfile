# base image
FROM node

# add `/usr/src/app/node_modules/.bin` to $PATH
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json ./
RUN npm i --legacy-peer-deps
# RUN npm i react-scripts@1.1.1 -g --silent
COPY . .
EXPOSE 3000
# start app
CMD ["npm", "start"]