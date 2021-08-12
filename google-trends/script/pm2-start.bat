@echo off
for /F "tokens=2" %%i in ('date /t') do set mydate=%%i
set mytime=%time%
echo Current time is %mydate% %mytime%

cd C:\etc\.pm2
pm2 start ecosystem.config.js --env=production