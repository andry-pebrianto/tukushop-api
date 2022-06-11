const db = require("../config/db");

module.exports = {
	insertTransaction: (data) =>
		new Promise((resolve, reject) => {
			const {
				id,
				userId,
				invoice,
				total,
				paymentMethod,
				status,
				city,
				postalCode,
				address,
				recipientPhone,
				recipientName,
				date,
			} = data;

			db.query(
				"INSERT INTO transaction (id, user_id, invoice, date, total, payment_method, status, city, postal_code, address, recipient_phone, recipient_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id",
				[
					id,
					userId,
					invoice,
					date,
					total,
					paymentMethod,
					status,
					city,
					postalCode,
					address,
					recipientPhone,
					recipientName,
				],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	insertTransactionDetail: (data) =>
		new Promise((resolve, reject) => {
			const {
				id,
				transactionId,
				productId,
				price,
				qty,
			} = data;

			db.query(
				"INSERT INTO transaction_detail (id, transaction_id, product_id, price, qty) VALUES ($1, $2, $3, $4, $5)",
				[
					id,
					transactionId,
					productId,
					price,
					qty,
				],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	selectListTransaction: (paging, sort) =>
		new Promise((resolve, reject) => {
			let sql =
        "SELECT transaction.id, transaction.user_id, transaction.date, transaction.total, transaction.payment_method, transaction.status, transaction.city, transaction.postal_code, transaction.invoice, transaction.address, transaction.recipient_phone, transaction.recipient_name, users.name, users.photo, users.email, users.level FROM transaction INNER JOIN users ON users.id = transaction.user_id ";
			if (sort.trim() === "payment") {
				sql += "ORDER BY transaction.payment_method ";
			} else if (sort.trim() === "postal") {
				sql += "ORDER BY transaction.postal_code ";
			} else if (sort.trim() === "total") {
				sql += "ORDER BY transaction.total ";
			} else {
				sql += "ORDER BY transaction.date ";
			}
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;

			db.query(sql, (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	countTransaction: () =>
		new Promise((resolve, reject) => {
			let sql = "SELECT COUNT(*) FROM transaction INNER JOIN users ON transaction.user_id = users.id";

			db.query(sql, (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
};
