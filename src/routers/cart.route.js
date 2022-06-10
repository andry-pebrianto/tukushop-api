const express = require("express");

// import controller
const {
  addCart,
  myCart,
  deleteCart,
} = require("../controllers/cart.controller");

// import middleware
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer } = require("../middleware/authorization");
const runValidation = require("../middleware/runValidation");

// import validation rules
const { createValidation } = require("../validations/cart.validation");

const router = express.Router();

router
  .post("/cart", jwtAuth, onlyBuyer, createValidation, runValidation, addCart) // new cart buyer only
  .get("/my-cart", jwtAuth, onlyBuyer, myCart) // get all my cart
  .delete("/cart/:id", jwtAuth, onlyBuyer, deleteCart); // delete cart buyer only

module.exports = router;
