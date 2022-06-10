const { check } = require("express-validator");

const createValidation = [
  // categoryName
  check("categoryName", "category name cannot be empty").not().isEmpty(),
];
const updateValidation = [
  // categoryName
  check("categoryName", "category name cannot be empty").not().isEmpty(),
];
const statusValidation = [
  // isActive
  check("isActive", "is active cannot be empty").not().isEmpty(),
  check("isActive", "is active value must be booelean").isBoolean(),
];

module.exports = {
  createValidation,
  updateValidation,
  statusValidation,
};
