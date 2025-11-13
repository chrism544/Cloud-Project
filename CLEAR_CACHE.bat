@echo off
echo Clearing Next.js cache...
cd frontend
rmdir /s /q .next 2>nul
echo Cache cleared!
echo.
echo Now run: npm run dev
pause
