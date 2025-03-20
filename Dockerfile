# Rebuild the source code only when needed
FROM node:20-alpine
ARG BUILD_NAME
MAINTAINER Direct Insurance
LABEL build=${BUILD_NAME}
WORKDIR /app

COPY . .

# Install Czech Locale and Timezone
RUN apk add tzdata && cp /usr/share/zoneinfo/Europe/Prague /etc/localtime && echo "Europe/Prague" > /etc/timezone && apk del tzdata

# Download and update private ca certificates
RUN apk add curl && \
    curl -ks 'https://repo.difa.cz/global/openssl/triglav-DC03-CA.crt' -o '/usr/local/share/ca-certificates/triglav-DC03-CA.crt' && \
    curl -ks 'https://repo.difa.cz/global/openssl/CAdifa.crt' -o '/usr/local/share/ca-certificates/CAdifa.crt' && \
    /usr/sbin/update-ca-certificates && \
    apk del curl && \
    rm -rf /var/cache/apk/*

RUN npm install
EXPOSE 3000

CMD ["node", "/app/node_modules/.bin/next", "dev"]
