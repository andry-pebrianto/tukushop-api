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
	insertSeller: (body) =>
		new Promise((resolve, reject) => {
			const { id, userId, storeName } = body;

			db.query(
				"INSERT INTO store (id, user_id, store_name) VALUES ($1, $2, $3)",
				[id, userId, storeName],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
};
