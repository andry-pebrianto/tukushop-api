const express = require("express");
// const { isVerified } = require("../middlewares/authorization");
const validation = require("../validations/auth.validation");
const runValidation = require("../middleware/runValidation");
const { registerBuyer } = require("../controllers/auth.controller");

const router = express.Router();

router
	.post("/auth/register/buyer", validation.register, runValidation, registerBuyer);
// .get("/auth/activation/:token", activation)
// .post("/auth/login", isVerified, validation.login, runValidation, login);

module.exports = router;
