const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const authModel = require("../models/auth.model");
const userModel = require("../models/user.model");
const sendEmail = require("../helpers/email/sendEmail");
const activateAccountEmail = require("../helpers/email/activateAccountEmail");
// const jwtToken = require("../helpers/generateJwtToken");
const { success, failed } = require("../helpers/response");
const { EMAIL_FROM, API_URL } = require("../helpers/env");

module.exports = {
	registerBuyer: async (req, res) => {
		try {
			const user = await userModel.findBy("email", req.body.email);
			if (user.rowCount) {
				failed(res, {
					code: 409,
					status: "failed",
					message: "Register Failed",
					error: "Email already exist",
				});
				return;
			}

			const { name, email } = req.body;
			const password = await bcrypt.hash(req.body.password, 10);
			const token = crypto.randomBytes(30).toString("hex");

			const insertData = await authModel.registerBuyer({
				id: uuidv4(),
				name,
				email,
				password,
			});
			await userModel.insertBuyer({
				id: uuidv4(),
				userId: insertData.rows[0].id,
			});

			await authModel.updateToken(insertData.rows[0].id, token);

			// send email for activate account
			const templateEmail = {
				from: `"TukuShop" <${EMAIL_FROM}>`,
				to: req.body.email.toLowerCase(),
				subject: "Activate Your Account!",
				html: activateAccountEmail(`${API_URL}/auth/activation/${token}`),
			};
			sendEmail(templateEmail);

			success(res, {
				code: 201,
				status: "success",
				message: "Register Success",
				data: null,
			});
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
