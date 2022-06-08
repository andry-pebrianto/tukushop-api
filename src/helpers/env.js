require("dotenv").config();
module.exports = {
	HOST: process.env.DB_HOSTNAME,
	USER: process.env.DB_USERNAME,
	PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT,
	SERVER_PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET
};