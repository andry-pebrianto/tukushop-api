const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { success, failed } = require("../helpers/response");
// const userModel = require("../models/user.model");
// const productModel = require("../models/product.model");
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

			const transactionData = await transactionModel.insertTransaction({
				id: uuidv4(),
				userId: req.APP_DATA.tokenDecoded.id,
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
				transactionId: transactionData.rows[0].id,
				productId,
				price,
				qty,
			});

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

			if (transaction.rows[0].status !== 1) {
				failed(res, {
					code: 400,
					status: "error",
					message: "Cancel Transaction Failed",
					error: "You can't cancel this transaction",
				});
				return;
			}

			await transactionModel.changeTransactionStatus(id, 0);

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
