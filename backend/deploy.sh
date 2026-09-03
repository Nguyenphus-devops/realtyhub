#!/bin/bash

SERVER="vps-prod"
DIR="/home/giakhang/www/xgym/backend"

rsync -avz --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude dist \
  --exclude uploads \
  ./ $SERVER:$DIR

ssh $SERVER "
cd $DIR &&
npm install &&
npm run build &&
pm2 restart xgym-backend --update-env
"