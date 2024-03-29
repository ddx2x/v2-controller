FROM node:latest
WORKDIR /app

COPY package.json ./
RUN yarn install
RUN yarn build

# FROM nginx:1.19.0

# COPY nginx-default.conf.template /etc/nginx/conf.d/default.conf.template

# COPY docker-entrypoint.sh /
# RUN chmod +x docker-entrypoint.sh
# ENTRYPOINT ["/docker-entrypoint.sh"]
# CMD ["nginx", "-g", "daemon off;"]