const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { success, failed } = require("../helpers/response");
// const userModel = require("../models/user.model");
// const productModel = require("../models/product.model");
const transactionModel = require("../models/transaction.model");
// const createPagination = require("../helpers/createPagination");

module.exports = {
	createTransaction: async (req, res) => {
		try {
			const {
				productId,
				paymentMethod,
				status,
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
				status,
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
};
