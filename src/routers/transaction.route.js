const express = require("express");
const validation = require("../validations/transaction.validation");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer, onlyAdmin, onlySeller, buyerOrSeller } = require("../middleware/authorization");
const {
	createTransaction,
	listTransactionAdmin,
	cancelTransaction,
	packedTransaction,
	sentTransaction,
	completedTransaction,
	listTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

router
	.post("/transaction", jwtAuth, onlyBuyer, validation.insert, runValidation, createTransaction)
	.get("/transaction/admin", jwtAuth, onlyAdmin, listTransactionAdmin)
	// .get("/transaction/admin", jwtAuth, listTransactionAdmin)
	.get("/transaction", jwtAuth, buyerOrSeller, listTransaction)
	.get("/transaction/seller", jwtAuth, onlySeller, listTransaction)
	.put("/transaction/:id/cancel", jwtAuth, onlyBuyer, cancelTransaction)
	.put("/transaction/:id/packed", jwtAuth, onlySeller, packedTransaction)
	.put("/transaction/:id/sent", jwtAuth, onlySeller, sentTransaction)
	.put("/transaction/:id/completed", jwtAuth, onlyBuyer, completedTransaction);

module.exports = router;
