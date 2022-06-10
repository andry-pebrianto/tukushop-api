const express = require("express");
const validation = require("../validations/product.validation");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const multipleUpload = require("../middleware/multipleUpload");
const { onlySeller } = require("../middleware/authorization");
const { addProduct, listProduct, newProduct } = require("../controllers/product.controller");

const router = express.Router();

router
	.get("/product", jwtAuth, listProduct)
	.post("/product", jwtAuth, onlySeller, multipleUpload, validation.insert, runValidation, addProduct)
	.get("/product/new", jwtAuth, newProduct);

module.exports = router;