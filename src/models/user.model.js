const db = require("../config/db");

module.exports = {
	findBy: (field, search) =>
		new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users WHERE ${field}=$1`,
				[search],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	insertBuyer: (body) =>
		new Promise((resolve, reject) => {
			const { id, userId } = body;

			db.query(
				"INSERT INTO profile (id, user_id) VALUES ($1, $2)",
				[id, userId],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
};
