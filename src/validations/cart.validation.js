const { check } = require("express-validator");

const createValidation = [
	// productId
	check("productId", "Product id cannot be empty").not().isEmpty(),

	// qty
	check("qty", "qty cannot be empty").not().isEmpty(),
	check("qty", "qty value must be number").isInt(),
	check("qty", "Minimal value for qty is 1").isInt({
		min: 1,
	}),

	// color
	check("color", "color cannot be empty").not().isEmpty(),

	// size
	check("size", "size cannot be empty").not().isEmpty(),
];

module.exports = { createValidation };
