const userModel = require("../models/user.model");
const { failed } = require("../helpers/response");
const productModel = require("../models/product.model");

module.exports = {
	isVerified: async (req, res, next) => {
		try {
			const user = await userModel.findBy("email", req.body.email);

			if (!user.rowCount) {
				next();
			} else if (user.rows[0].is_verified) {
				next();
			} else {
				failed(res, {
					code: 401,
					status: "failed",
					message: "Unauthorized",
					error: "Your email is not verified yet",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	myself: async (req, res, next) => {
		try {
			const idUser = req.APP_DATA.tokenDecoded.id;
			const idUpdate = req.params.id;

			if (idUser === idUpdate) {
				next();
			} else {
				failed(res, {
					code: 401,
					status: "failed",
					message: "Unauthorized",
					error: "You do not have access",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	onlyAdmin: async (req, res, next) => {
		try {
			const user = await userModel.findBy("id", req.APP_DATA.tokenDecoded.id);

			if (user.rows[0].level === 1) {
				next();
			} else {
				failed(res, {
					code: 401,
					status: "failed",
					message: "Unauthorized",
					error: "You do not have access",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	onlySeller: async (req, res, next) => {
		try {
			const user = await userModel.findBy("id", req.APP_DATA.tokenDecoded.id);

			if (user.rows[0].level === 2) {
				next();
			} else {
				failed(res, {
					code: 401,
					status: "failed",
					message: "Unauthorized",
					error: "You do not have access",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	onlyBuyer: async (req, res, next) => {
		try {
			const user = await userModel.findBy("id", req.APP_DATA.tokenDecoded.id);

			if (user.rows[0].level === 3) {
				next();
			} else {
				failed(res, {
					code: 401,
					status: "failed",
					message: "Unauthorized",
					error: "You do not have access",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	buyerOrSeller: async (req, res, next) => {
		try {
			const user = await userModel.findBy("id", req.APP_DATA.tokenDecoded.id);

			if (user.rows[0].level === 3 || user.rows[0].level === 2) {
				next();
			} else {
				failed(res, {
					code: 401,
					status: "failed",
					message: "Unauthorized",
					error: "You do not have access",
				});
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	productOwner: async (req, res, next) => {
		try {
			const idUser = req.APP_DATA.tokenDecoded.id;
			const idUpdate = req.params.id;

			const product = await productModel.findBy("id", idUpdate);

			if (!product.rowCount) {
				next();
			} else {
				const store = await userModel.findStoreBy("id", product.rows[0].store_id);

				if (idUser === store.rows[0].user_id) {
					next();
				} else {
					failed(res, {
						code: 401,
						status: "failed",
						message: "Unauthorized",
						error: "You do not have access",
					});
				}
			}
		} catch (error) {
			failed(res, {
				code: 500,
				status: "failed",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
};
