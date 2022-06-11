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
};
