const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { success, failed } = require("../helpers/response");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const transactionModel = require("../models/transaction.model");
const createPagination = require("../helpers/createPagination");

module.exports = {
	createTransaction: async (req, res) => {
		try {
			const {
				productId,
				paymentMethod,
				city,
				postalCode,
				address,
				recipientPhone,
				recipientName,
				price,
				qty,
			} = req.body;

			const product = await productModel.findBy("id", productId);
			const store = await userModel.findStoreBy("id", product.rows[0].store_id);
			const user = await userModel.findBy("id", store.rows[0].user_id);
			const transactionData = await transactionModel.insertTransaction({
				id: uuidv4(),
				invoice: crypto.randomBytes(10).toString("hex"),
				total: price * qty,
				paymentMethod,
				status: 1,
				city,
				postalCode,
				address,
				recipientPhone,
				recipientName,
				date: new Date(),
			});

			await transactionModel.insertTransactionDetail({
				id: uuidv4(),
				buyerId: req.APP_DATA.tokenDecoded.id,
				sellerId: user.rows[0].id,
				transactionId: transactionData.rows[0].id,
				productId,
				price,
				qty,
			});

			const newStock = product.rows[0].stock - qty;
			await productModel.reduceStock(productId, newStock);

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Create Transaction Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	getAllTransaction: async (req, res) => {
		try {
			const { page, limit, sort = "" } = req.query;
			const count = await transactionModel.countTransaction();
			const paging = createPagination(count.rows[0].count, page, limit);
			const transactions = await transactionModel.selectListTransaction(
				paging,
				sort
			);

			for(let i = 0; i < transactions.rows.length; i++) {
				const sellerData = await userModel.findBy(
					"id", transactions.rows[i].seller_id,
				);
				const buyerData = await userModel.findBy(
					"id", transactions.rows[i].buyer_id,
				);

				transactions.rows[i].seller_data = sellerData.rows[0];
				transactions.rows[i].buyer_data = buyerData.rows[0];
			}

			success(res, {
				code: 200,
				status: "success",
				data: transactions.rows,
				message: "Select List Transaction Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	cancelTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);

			if(transaction.rowCount) {
				if (transaction.rows[0].status !== 1) {
					failed(res, {
						code: 400,
						status: "error",
						message: "Cancel Transaction Failed",
						error: "You can't cancel this transaction",
					});
					return;
				}
			}

			await transactionModel.changeTransactionStatus(id, 0);


			// for get product_id
			const transactionDetail = await transactionModel.findDetailBy("transaction_id", id);
			// for get current stock product
			const product = await productModel.findBy("id", transactionDetail.rows[0].product_id);
			// current stock - qty
			const newStock = product.rows[0].stock + transactionDetail.rows[0].qty;
			// reduce stock
			await productModel.reduceStock(transactionDetail.rows[0].product_id, newStock);

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Cancel Transaction Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	packedTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);
			
			if(transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Packed Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}
			
			await transactionModel.changeTransactionStatus(id, 2);

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Packed Transaction Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	sentTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);

			if(transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Sent Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}

			await transactionModel.changeTransactionStatus(id, 3);

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Sent Transaction Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	completedTransaction: async (req, res) => {
		try {
			const { id } = req.params;
			const transaction = await transactionModel.findBy("id", id);

			if(transaction.rowCount) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Completed Transaction Failed",
					error: "Transaction not found",
				});
				return;
			}

			await transactionModel.changeTransactionStatus(id, 4);

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Completed Transaction Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
};

// status
// 0 = cancelled
// 1 = new
// 2 = packed
// 3 = sent
// 4 = completed
