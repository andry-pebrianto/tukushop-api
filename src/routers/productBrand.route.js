const express = require("express");

// import controller
const {
  addProductBrand,
  detailProductBrand,
  updateProductBrand,
  statusProductBrand,
  allProductBrand,
  allProductBrandActive,
  deleteProductBrand,
} = require("../controllers/productBrand.controller");

// import middleware
const upload = require("../middleware/upload");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const { onlyAdmin, buyerOrSeller } = require("../middleware/authorization");

// import validation rules
const {
  createValidation,
  updateValidation,
  statusValidation,
} = require("../validations/productBrand.validation");

const router = express.Router();

router
  .get("/product-brand", jwtAuth, onlyAdmin, allProductBrand) // get all product brand admin only
  .get("/product-brand-active", jwtAuth, buyerOrSeller, allProductBrandActive) // get all product status active buyer or seller
  .get("/product-brand/:id", jwtAuth, onlyAdmin, detailProductBrand) // get detail product brand admin only
  .post(
    "/product-brand",
    jwtAuth,
    onlyAdmin,
    upload,
    createValidation,
    runValidation,
    addProductBrand
  ) // add product brand admin only
  .put(
    "/product-brand/:id",
    jwtAuth,
    onlyAdmin,
    upload,
    updateValidation,
    runValidation,
    updateProductBrand
  ) // update brand admin only
  .put(
    "/product-brand-status/:id",
    jwtAuth,
    onlyAdmin,
    statusValidation,
    runValidation,
    statusProductBrand
  ) // update status product brand admin only
  .delete("/product-brand/:id", jwtAuth, onlyAdmin, deleteProductBrand); // delete product brand admin only

module.exports = router;
