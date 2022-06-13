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
	findStoreBy: (field, search) =>
		new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM store WHERE ${field}=$1`,
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
        "SELECT users.id, users.name, users.email, users.level, users.photo, profile.birth, profile.phone, profile.gender FROM users INNER JOIN profile ON profile.user_id = users.id WHERE users.level=3 AND LOWER(users.name) LIKE '%'||LOWER($1)||'%'";
			if (sort.trim() === "email") {
				sql += "ORDER BY users.email ";
			} else if (sort.trim() === "birth") {
				sql += "ORDER BY profile.birth ";
			} else {
				sql += "ORDER BY users.name ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;

			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	countBuyer: (search) =>
		new Promise((resolve, reject) => {
			let sql =
        "SELECT COUNT(*) FROM users INNER JOIN profile ON profile.user_id = users.id WHERE users.level=3 AND LOWER(users.name) LIKE '%'||LOWER($1)||'%'";

			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	selectAllSeller: (paging, search, sort) =>
		new Promise((resolve, reject) => {
			let sql =
        "SELECT users.id, users.name, users.level, users.email, users.photo, store.store_name, store.store_phone, store.store_description FROM users INNER JOIN store ON store.user_id = users.id WHERE users.level=2 AND LOWER(name) LIKE '%'||LOWER($1)||'%' OR LOWER(store_name) LIKE '%'||LOWER($1)||'%' ";
			if (sort.trim() === "email") {
				sql += "ORDER BY users.email ";
			} else if (sort.trim() === "store") {
				sql += "ORDER BY store.store_name ";
			} else {
				sql += "ORDER BY users.name ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;

			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	countSeller: (search) =>
		new Promise((resolve, reject) => {
			let sql =
        "SELECT COUNT(*) FROM users INNER JOIN store ON store.user_id = users.id WHERE users.level=2 AND LOWER(name) LIKE '%'||LOWER($1)||'%' OR LOWER(store_name) LIKE '%'||LOWER($1)||'%'";

			db.query(sql, [search], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	getDetailBuyer: (id) =>
		new Promise((resolve, reject) => {
			db.query(
				"SELECT users.id, users.name, users.photo, users.email, profile.phone, profile.gender, profile.birth FROM users INNER JOIN profile ON profile.user_id = users.id WHERE users.id=$1",
				[id],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	getDetailSeller: (id) =>
		new Promise((resolve, reject) => {
			db.query(
				"SELECT users.id, users.name, users.photo, users.email, store.id AS store_id, store.store_name, store.store_phone, store.store_description FROM users INNER JOIN store ON store.user_id = users.id WHERE users.id=$1",
				[id],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	listChat: (sender, receiver) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM chat LEFT JOIN users AS userSender ON chat.sender=userSender.id LEFT JOIN users AS userReceiver ON chat.receiver=userReceiver.id WHERE (sender='${sender}' AND receiver='${receiver}') OR (sender='${receiver}' AND receiver='${sender}')`,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
};
