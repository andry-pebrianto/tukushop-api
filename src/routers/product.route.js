const express = require("express");
const validation = require("../validations/product.validation");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const multipleUpload = require("../middleware/multipleUpload");
const { onlySeller, productOwner } = require("../middleware/authorization");
const { addProduct, listProduct, newProduct, disableProduct } = require("../controllers/product.controller");

const router = express.Router();

router
	.get("/product", jwtAuth, listProduct)
	.post("/product", jwtAuth, onlySeller, multipleUpload, validation.insert, runValidation, addProduct)
	.get("/product/new", jwtAuth, newProduct)
	.put("/product/:id/disable", jwtAuth, onlySeller, productOwner, disableProduct);

module.exports = router;