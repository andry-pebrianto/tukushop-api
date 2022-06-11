const express = require("express");
// const validation = require("../validations/product.validation");
// const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer, onlyAdmin } = require("../middleware/authorization");
const { createTransaction, getAllTransaction } = require("../controllers/transaction.controller");

const router = express.Router();

router
	.post("/transaction", jwtAuth, onlyBuyer, createTransaction)
	.get("/transaction", jwtAuth, onlyAdmin, getAllTransaction);

module.exports = router;
