@echo off
chcp 65001 >nul
start "" "%~dp0index.html"
echo Сайт открывается в браузере...
timeout /t 3 >nul
