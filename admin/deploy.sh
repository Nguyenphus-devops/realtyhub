#!/bin/bash

SERVER="vps-prod"
DIR="/home/giakhang/www/xgym/admin"

rsync -avz --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude .next \
  ./ $SERVER:$DIR

ssh $SERVER "
cd $DIR &&
npm install &&
npm run build &&
pm2 restart xgym-admin --update-env
"