**Backend**
# Antes de correr cualquier cosa debemos bajar las dependencias:
npm i

# Para poder crear la conexion con la base de datos debemos crear un .env en la raiz de backend con este formato(ejemplo en .env.example):
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
FINNHUB_API_KEY=

# Para iniciar el backend debemos pararnos sobre la carpeta correspondiente, e iniciar el server:
cd backend/

npm run start:dev

# Para acceder a la documentacion del swagger debemos inicializar el server y acceder a la siguiente url:
http://localhost:3000/api/docs

# Para correr los tests unitarios:
npm run test

# Para ver la cobertura de los tests:
npm run test:cov

## Datos de no poca importancia
los seeders se inicializan al ejecutar la compilacion
No es necesario instalar mas dependencias(con el "npm i" es suficiente)


**Frontend**
# Antes de correr cualquier cosa debemos bajar las dependencias:
npm i

# Para poder crear la definir la ruta creamos un archivo .env con este formato(ejemplo en .env.example):
NEXT_PUBLIC_API_HOST=localhost
NEXT_PUBLIC_API_PORT=3000

# Para iniciar el frontend debemos pararnos sobre la carpeta correspondiente, e iniciar cliente:
cd frontend/

npm run dev
# Y accedemos al cliente por esta URL:
http://localhost:3001