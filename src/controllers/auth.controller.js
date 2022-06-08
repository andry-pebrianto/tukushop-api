const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const authModel = require("../models/auth.model");
const userModel = require("../models/user.model");
const sendEmail = require("../helpers/email/sendEmail");
const activateAccountEmail = require("../helpers/email/activateAccountEmail");
const jwtToken = require("../helpers/generateJwtToken");
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

			const insertData = await authModel.register({
				id: uuidv4(),
				name,
				email,
				password,
				level: 3,
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
	registerSeller: async (req, res) => {
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

			const { name, email, storeName } = req.body;
			const password = await bcrypt.hash(req.body.password, 10);
			const token = crypto.randomBytes(30).toString("hex");

			const insertData = await authModel.register({
				id: uuidv4(),
				name,
				email,
				password,
				level: 2,
			});
			await userModel.insertSeller({
				id: uuidv4(),
				userId: insertData.rows[0].id,
				storeName,
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
	activation: async (req, res) => {
		try {
			const { token } = req.params;
			const user = await userModel.findBy("token", token);

			if (!user.rowCount) {
				res.send(`
        <div>
          <h1>Activation Failed</h1>
          <h3>Token invalid</h3>
        </div>`);
				return;
			}
			await authModel.activateEmail(user.rows[0].id);
			await authModel.updateToken(user.rows[0].id, "");

			res.send(`
      <div>
        <h1>Activation Success</h1>
        <h3>You can login now</h3>
      </div>`);
		} catch (error) {
			res.send(`
      <div>
        <h1>Activation Failed</h1>
        <h3>${error.message}</h3>
      </div>`);
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await userModel.findBy("email", email);

			// jika user ditemukan
			if (user.rowCount > 0) {
				const match = await bcrypt.compare(password, user.rows[0].password);
				// jika password benar
				if (match) {
					const jwt = await jwtToken({
						id: user.rows[0].id,
						level: user.rows[0].level,
					});
					success(res, {
						code: 200,
						payload: null,
						message: "Login Success",
						token: {
							jwt,
							id: user.rows[0].id,
						},
					});
					return;
				}
			}

			failed(res, {
				code: 401,
				status: "failed",
				message: "Login Failed",
				error: "Wrong Email or Password",
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
