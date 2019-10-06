FROM nginx:alpine
ENV NODE_ENV=production
COPY static /usr/share/nginx/html/
EXPOSE 80