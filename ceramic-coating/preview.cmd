@echo off
setlocal
pushd "%~dp0"
echo Ceramic coating preview: http://127.0.0.1:4173/ceramic-coating/
echo Press Ctrl+C to stop. No deployment is performed.
if exist "C:\Program Files\nodejs\node.exe" (
  "C:\Program Files\nodejs\node.exe" tools\serve.mjs
) else (
  node tools\serve.mjs
)
popd
pause
