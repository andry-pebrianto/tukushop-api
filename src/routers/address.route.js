const express = require("express");

// import controller
const {
  addAddress,
  myAddress,
  updateMyAddress,
  deleteAddress,
} = require("../controllers/address.controller");

// import middleware
const jwtAuth = require("../middleware/jwtAuth");
const { onlyBuyer } = require("../middleware/authorization");
const runValidation = require("../middleware/runValidation");

// import validation rules
const {
  createValidation,
  updateValidation,
} = require("../validations/address.validation");

const router = express.Router();

router
  .get("/my-address", jwtAuth, onlyBuyer, myAddress) // get my address buyer only
  .post(
    "/address",
    jwtAuth,
    onlyBuyer,
    createValidation,
    runValidation,
    addAddress
  ) // add new address buyer only
  .put(
    "/address/:id",
    jwtAuth,
    onlyBuyer,
    updateValidation,
    runValidation,
    updateMyAddress
  ) // update address owner address only
  .delete("/address/:id", jwtAuth, onlyBuyer, deleteAddress); // delete address owner only
module.exports = router;
