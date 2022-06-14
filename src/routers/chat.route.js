const express = require("express");
const { insertInitialChat } = require("../controllers/chat.controller");
const jwtAuth = require("../middleware/jwtAuth");

const router = express.Router();

router
	.post("/chat", jwtAuth, insertInitialChat);

module.exports = router;