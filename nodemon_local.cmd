@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "C:\Users\whearn\AppData\Roaming\npm\node_modules\nodemon\nodemon.js" app.js
) ELSE (
  node  "C:\Users\whearn\AppData\Roaming\npm\node_modules\nodemon\nodemon.js" app.js
)