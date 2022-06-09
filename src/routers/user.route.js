const express = require("express");
const validation = require("../validations/user.validation");
const runValidation = require("../middleware/runValidation");
const { editProfileBuyer, editProfileSeller, getListBuyer, getListSeller } = require("../controllers/user.controller");
const jwtAuth = require("../middleware/jwtAuth");
const upload = require("../middleware/upload");
const {onlyAdmin, myself} = require("../middleware/authorization");

const router = express.Router();

router
	.get("/user/buyer", jwtAuth, onlyAdmin, getListBuyer)
	.get("/user/seller", jwtAuth, onlyAdmin, getListSeller)
	.put("/user/:id/buyer", jwtAuth, myself, upload, validation.buyer, runValidation, editProfileBuyer)
	.put("/user/:id/seller", jwtAuth, myself, upload, validation.seller, runValidation, editProfileSeller);

module.exports = router;