# start from a image that has node js
FROM anjali1585/nodejs:0.2

# share code with the image /root/app
ADD . /root/app

# remove the default bashrc
# RUN rm -rf /root/.bashrc
# RUN echo "export PATH=\"node_modules/.bin:$PATH\"" >> /root/.bashrc

# expose the port where the app is listening
EXPOSE 4004

# change current workdir to app
WORKDIR /root/app

# install all dependencies and start server
CMD npm install && npm start 4004
