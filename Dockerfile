FROM node:14-alpine AS build
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .



COPY packages/common ./packages/common
COPY packages/client ./packages/client
COPY packages/admin ./packages/admin
COPY nginx/nginx.conf ./nginx/nginx.conf
RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/client
RUN yarn build

# WORKDIR /usr/src/app/packages/admin
# RUN yarn install --production
# RUN yarn build

FROM node:14-alpine
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY --from=build /usr/src/app/packages/client/package.json /usr/src/app/packages/client/package.json
COPY --from=build /usr/src/app/packages/client/build /usr/src/app/packages/client/build

# COPY --from=build /usr/src/app/packages/admin/package.json /usr/src/app/packages/admin/package.json
# COPY --from=build /usr/src/app/packages/admin/build /usr/src/app/packages/admin/build



# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage

COPY --from=build /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/packages/client/build .
# Containers run nginx with global directives and daemon off
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

