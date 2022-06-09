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
	updateUser: (id, body) =>
		new Promise((resolve, reject) => {
			const { name, photo } = body;

			db.query(
				"UPDATE users SET name=$1, photo=$2 WHERE id=$3",
				[name, photo, id],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	updateProfileBuyer: (id, body) =>
		new Promise((resolve, reject) => {
			const { phone, gender, birth } = body;

			db.query(
				"UPDATE profile SET phone=$1, gender=$2, birth=$3 WHERE user_id=$4",
				[phone, gender, birth, id],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	updateProfileSeller: (id, body) =>
		new Promise((resolve, reject) => {
			const { storeName, storePhone, storeDescription } = body;

			db.query(
				"UPDATE store SET store_name=$1, store_phone=$2, store_description=$3 WHERE user_id=$4",
				[storeName, storePhone, storeDescription, id],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	selectAllBuyer: (paging, search, sort) =>
		new Promise((resolve, reject) => {
			let sql =
        "SELECT users.id, users.name, users.level, users.photo, profile.birth, profile.phone, profile.gender FROM users INNER JOIN profile ON profile.user_id = users.id WHERE level=3 AND LOWER(name) LIKE '%'||LOWER($1)||'%'";
			if (sort.trim() === "email") {
				sql += "ORDER BY email ";
			} else if (sort.trim() === "birth") {
				sql += "ORDER BY birth ";
			} else {
				sql += "ORDER BY name ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;

			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	countBuyer: () =>
		new Promise((resolve, reject) => {
			db.query("SELECT COUNT(*) FROM users WHERE level=3", (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
};
