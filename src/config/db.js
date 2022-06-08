const { HOST, USER, PASSWORD, DB_NAME, DB_PORT } = require("../helpers/env");
const { Pool } = require("pg");
const db = new Pool({
	host: HOST,
	user: USER,
	password: PASSWORD,
	database: DB_NAME,
	port: DB_PORT
});
db.connect((err) => {
	if (err) {
		console.log(err);
	}
});
module.exports = db;
