const express = require("express");
// const validation = require("../validations/user.validation");
// const runValidation = require("../middleware/runValidation");
const { editProfileBuyer } = require("../controllers/user.controller");
const jwtAuth = require("../middleware/jwtAuth");
const upload = require("../middleware/upload");

const router = express.Router();

router
	.put("/user/:id/buyer", jwtAuth, upload, editProfileBuyer);

module.exports = router;