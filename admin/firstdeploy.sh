#!/bin/bash

SERVER="vps-prod"
DIR="/home/giakhang/www/xgym/admin"

echo "==> Creating remote directory..."
ssh $SERVER "mkdir -p $DIR"

echo "==> First sync source code..."
rsync -avz \
  --exclude node_modules \
  --exclude .git \
  --exclude .next \
  ./ $SERVER:$DIR

echo "==> Install dependencies + build + start app..."
ssh $SERVER "
cd $DIR &&
npm install &&
npm run build &&
pm2 start ecosystem.config.js
"

echo "==> First deploy completed"