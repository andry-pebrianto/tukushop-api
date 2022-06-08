require("dotenv").config();
module.exports = {
	HOST: process.env.DB_HOSTNAME,
	USER: process.env.DB_USERNAME,
	PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT,
	SERVER_PORT: process.env.PORT,
	API_URL: process.env.API_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	EMAIL_FROM: process.env.EMAIL_FROM,
	EMAIL_USER: process.env.EMAIL_USER,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	REDIRECT_URI: process.env.REDIRECT_URI,
	GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
	DRIVE_REFRESH_TOKEN: process.env.DRIVE_REFRESH_TOKEN,
};