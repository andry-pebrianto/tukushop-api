const express = require("express");

// import controller
const {
  addCategory,
  allCategory,
  detailCategory,
  allCategoryActive,
  updateCategory,
  statusCategory,
  deleteCategory,
} = require("../controllers/category.controller");

// import middlewares
const upload = require("../middleware/upload");
const runValidation = require("../middleware/runValidation");
const jwtAuth = require("../middleware/jwtAuth");
const {
  onlyAdmin,
  onlyBuyer,
  onlySeller,
  buyerOrSeller,
} = require("../middleware/authorization");
// import validation rules
const {
  createValidation,
  updateValidation,
  statusValidation,
} = require("../validations/category.validation");

const router = express.Router();

router
  .get("/category", jwtAuth, onlyAdmin, allCategory) // get all category admin only
  .get("/category-active", jwtAuth, buyerOrSeller, allCategoryActive) // get category activ only buyer seller
  .get("/category/:id", jwtAuth, onlyAdmin, detailCategory) // get detail category admin only
  .post(
    "/category",
    jwtAuth,
    onlyAdmin,
    upload,
    createValidation,
    runValidation,
    addCategory
  ) // add category admin only
  .put("/category/:id", upload, updateValidation, runValidation, updateCategory) // update category admin only
  .put(
    "/category-status/:id",
    jwtAuth,
    onlyAdmin,
    statusValidation,
    runValidation,
    statusCategory
  ) // admin only
  .delete("/category/:id", jwtAuth, onlyAdmin, deleteCategory); // delete category only admin

module.exports = router;
