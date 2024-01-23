Bot para gestión de roles según una suscripción realizada en wix

TOKEN: Token del bot de discord
API_KEY: Api key de wix
ACCOUNT_ID: Id de la cuenta de wix
SITE_ID: Id del sitio de wix
GUILD_ID: Id del servidor. Se usa para revisar que los mensajes provengan del servidor correcto

Para iniciar el bot:

- Crear un archivo .env en la carpeta raíz y cargar las variables requeridas.
- Crear un archivo database.db en la ruta src/db/ o dist/db/ según corresponda.
- Usar el comando npm db:push para generar las tablas
- npm run dev para correr el bot
