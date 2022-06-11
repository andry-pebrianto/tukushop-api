const express = require("express");
// const validation = require("../validations/product.validation");
// const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer } = require("../middleware/authorization");
const { createTransaction } = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/transaction", jwtAuth, onlyBuyer, createTransaction);

module.exports = router;
