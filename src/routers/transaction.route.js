const express = require("express");
// const validation = require("../validations/product.validation");
// const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer, onlyAdmin } = require("../middleware/authorization");
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
	.post("/transaction", jwtAuth, onlyBuyer, createTransaction)
	// .get("/transaction", jwtAuth, onlyAdmin, getAllTransaction)
	.get("/transaction", jwtAuth, getAllTransaction)
	.put("/transaction/:id/cancel", jwtAuth, onlyBuyer, cancelTransaction)
	.put("/transaction/:id/packed", jwtAuth, onlyAdmin, packedTransaction)
	.put("/transaction/:id/sent", jwtAuth, onlyAdmin, sentTransaction)
	.put("/transaction/:id/completed", jwtAuth, onlyBuyer, completedTransaction);

module.exports = router;
