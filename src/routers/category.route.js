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
const categoryUpload = require("../middleware/categoryUpload");
const validation = require("../middleware/validation");

// import validation rules
const {
  createValidation,
  updateValidation,
  statusValidation,
} = require("../validation/category.validation");

const router = express.Router();

router
  .get("/category", allCategory) // get all category admin only
  .get("/category-active", allCategoryActive) // get category activ only buyer seller
  .get("/category/:id", detailCategory) // get detail category admin only
  .post("/category", categoryUpload, createValidation, validation, addCategory) // add category admin only
  .put(
    "/category/:id",
    categoryUpload,
    updateValidation,
    validation,
    updateCategory
  ) // update category admin only
  .put("/category-status/:id", statusValidation, validation, statusCategory) // admin only
  .delete("/category/:id", deleteCategory);

module.exports = router;
