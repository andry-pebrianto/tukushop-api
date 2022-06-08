const { validationResult } = require("express-validator");
const { failed } = require("../helpers/response");

module.exports = (req, res, next) => {
	try {
		const errors = validationResult(req).array({ onlyFirstError: true });

		// jika validasi gagal
		if (errors.length) {
			failed(res, {
				code: 400,
				status: "failed",
				message: "Validation Failed",
				error: errors,
			});
			return;
		}

		next();
	} catch (error) {
		failed(res, {
			code: 500,
			status: "failed",
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
