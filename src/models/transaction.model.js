const db = require("../config/db");

module.exports = {
	findBy: (field, search) =>
		new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM transaction WHERE ${field}=$1`,
				[search],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	findDetailBy: (field, search) =>
		new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM transaction_detail WHERE ${field}=$1`,
				[search],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	insertTransaction: (data) =>
		new Promise((resolve, reject) => {
			const {
				id,
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
				color,
				size,
			} = data;

			db.query(
				"INSERT INTO transaction (id, invoice, date, total, payment_method, status, city, postal_code, address, recipient_phone, recipient_name, color, size) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id",
				[
					id,
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
					color,
					size,
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
			const { id, transactionId, productId, sellerId, buyerId, price, qty } =
        data;

			db.query(
				"INSERT INTO transaction_detail (id, transaction_id, product_id, seller_id, buyer_id, price, qty) VALUES ($1, $2, $3, $4, $5, $6, $7)",
				[id, transactionId, productId, sellerId, buyerId, price, qty],
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
        "SELECT transaction.id, transaction.size, transaction.color, transaction.date, transaction.total, transaction.payment_method, transaction.status, transaction.city, transaction.postal_code, transaction.invoice, transaction.address, transaction.recipient_phone, transaction.recipient_name, transaction_detail.seller_id, transaction_detail.buyer_id, transaction_detail.qty FROM transaction INNER JOIN transaction_detail ON transaction.id = transaction_detail.transaction_id ";
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
			let sql =
        "SELECT COUNT(*) FROM transaction INNER JOIN transaction_detail ON transaction.id = transaction_detail.transaction_id";

			db.query(sql, (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	changeTransactionStatus: (id, status) =>
		new Promise((resolve, reject) => {
			db.query(
				"UPDATE transaction SET status=$1 WHERE id=$2",
				[status, id],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	getListBuyerTransaction: (id, paging) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT transaction.id, transaction.size, transaction.color, transaction_detail.price, transaction_detail.qty, transaction.date, transaction.total, transaction.payment_method, transaction.status, transaction.address, transaction.invoice, transaction.postal_code, transaction.recipient_name, transaction.recipient_phone, product.product_name, product.description FROM transaction_detail INNER JOIN transaction ON transaction_detail.transaction_id=transaction.id INNER JOIN product ON transaction_detail.product_id=product.id WHERE transaction_detail.buyer_id=$1 ";
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;

			db.query(sql, [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	countGetListBuyerTransaction: (id) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT * FROM transaction_detail INNER JOIN transaction ON transaction_detail.transaction_id=transaction.id INNER JOIN product ON transaction_detail.product_id=product.id WHERE transaction_detail.buyer_id=$1";

			db.query(sql, [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	getListSellerTransaction: (id, paging) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT transaction.id, transaction.size, transaction.color, transaction_detail.price, transaction_detail.qty, transaction.date, transaction.total, transaction.payment_method, transaction.status, transaction.address, transaction.invoice, transaction.postal_code, transaction.recipient_name, transaction.recipient_phone, product.product_name, product.description FROM transaction_detail INNER JOIN transaction ON transaction_detail.transaction_id=transaction.id INNER JOIN product ON transaction_detail.product_id=product.id WHERE transaction_detail.seller_id=$1 ";
			sql += `LIMIT ${paging.limit} OFFSET ${paging.offset}`;

			db.query(sql, [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	countGetListSellerTransaction: (id) =>
		new Promise((resolve, reject) => {
			let sql = "SELECT * FROM transaction_detail INNER JOIN transaction ON transaction_detail.transaction_id=transaction.id INNER JOIN product ON transaction_detail.product_id=product.id WHERE transaction_detail.seller_id=$1";

			db.query(sql, [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
	detailTransaction: (id) =>
		new Promise((resolve, reject) => {
			db.query("SELECT transaction.id, transaction.size, transaction.color, transaction.invoice, transaction.payment_method, transaction.status, transaction.total, transaction_detail.price, transaction.date, transaction.address, product.product_name FROM transaction_detail INNER JOIN transaction ON transaction.id=transaction_detail.transaction_id INNER JOIN product ON transaction_detail.product_id=product.id WHERE transaction_detail.transaction_id=$1", [id], (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		}),
};
