#!/bin/sh
### Description: Deploy google-trends project
###### ====> First: Stop app (Run as Administrator)
### ---------------
### $ pm2 stop all
### ---------------
###### ====> End: Start app (Run as Administrator)
### ---------------
### $ pm2 start all
### ---------------

## Remove old logs (backup)
echo -e "\e[33mRemoving backup old logs"
rm -rf /c/etc/.pm2/logs_bak

## Remove old project (backup)
echo -e "\e[33mRemoving backup old deployed app"
rm -rf /d/deploy/google-trends_bak

## Backup current logs
echo -e "\e[32mBackup current logs"
mv /c/etc/.pm2/logs /c/etc/.pm2/logs_bak

## Backup current application
echo -e "\e[32mBackup current app, logs"
mv /d/deploy/google-trends /d/deploy/google-trends_bak

## Move `dist` folder to deploy folder
echo -e "\e[32mCopying dist folder to deploy folder"
cp -r /d/GitHub/nodejs/google-trends/dist /d/deploy/google-trends

## Install lib nodejs
echo -e "\e[32mInstalling package"
cd /d/deploy/google-trends
npm i


