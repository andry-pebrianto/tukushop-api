const userModel = require("../models/user.model");
const { failed } = require("../helpers/response");

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
};
