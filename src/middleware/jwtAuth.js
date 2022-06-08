const { JWT_SECRET } = require("../helpers/env");
const jwt = require("jsonwebtoken");
const { failed } = require("../helpers/response");

module.exports = (req, res, next) => {
	try {
		const { token } = req.headers;
		const decoded = jwt.verify(token, JWT_SECRET);
		req.APP_DATA = { tokenDecoded: decoded };
		next();
	} catch (err) {
		failed(res, {
			code: 400,
			status: "error",
			message: "Bad Request",
			error: err.message
		});
	}
};
