const express = require("express");
const validation = require("../validations/transaction.validation");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer, onlyAdmin, onlySeller } = require("../middleware/authorization");
const {
	createTransaction,
	getAllTransaction,
	cancelTransaction,
	packedTransaction,
	sentTransaction,
	completedTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

router
	.post("/transaction", jwtAuth, onlyBuyer, validation.insert, runValidation, createTransaction)
	.get("/transaction", jwtAuth, onlyAdmin, getAllTransaction)
	// .get("/transaction", jwtAuth, getAllTransaction)
	.put("/transaction/:id/cancel", jwtAuth, onlyBuyer, cancelTransaction)
	.put("/transaction/:id/packed", jwtAuth, onlySeller, packedTransaction)
	.put("/transaction/:id/sent", jwtAuth, onlySeller, sentTransaction)
	.put("/transaction/:id/completed", jwtAuth, onlyBuyer, completedTransaction);

module.exports = router;
