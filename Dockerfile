FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install

RUN npm install cheerio@1.0.0-rc.12

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
  
EXPOSE 3000

CMD ["node", "index.js"]
