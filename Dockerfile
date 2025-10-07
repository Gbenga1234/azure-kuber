FROM nginx:1.27-alpine
# copy your app (static site) into nginx html root
COPY index.html /usr/share/nginx/html/index.html
COPY assets/ /usr/share/nginx/html/assets/
# custom server config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf
