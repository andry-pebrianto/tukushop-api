const { check } = require("express-validator");

const createValidation = [
	// categoryName
	check("categoryName", "category name cannot be empty").not().isEmpty(),
	check(
		"categoryName",
		"category name must be between 3 and 50 characters"
	).isLength({
		min: 3,
		max: 50,
	}),
];
const updateValidation = [
	// categoryName
	check("categoryName", "category name cannot be empty").not().isEmpty(),
	check(
		"categoryName",
		"category name must be between 3 and 50 characters"
	).isLength({
		min: 3,
		max: 50,
	}),
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
