const express = require("express");
const validation = require("../validations/product.validation");
const runValidation = require("../middleware/runValidation");
const { addProduct } = require("../controllers/product.controller");
const jwtAuth = require("../middleware/jwtAuth");
const multipleUpload = require("../middleware/multipleUpload");
const { onlySeller } = require("../middleware/authorization");

const router = express.Router();

router.post(
	"/product",
	jwtAuth,
	onlySeller,
	multipleUpload,
	validation.insert,
	runValidation,
	addProduct
);

module.exports = router;
