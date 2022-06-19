const { check } = require("express-validator");

const insert = [
	// productName
	check("productName", "Product Name required").not().isEmpty(),
	check("productName", "Product Name maximum length is 100 characters").isLength({ max: 100 }),
	// price
	check("price", "Price required").not().isEmpty(),
	check("price", "Price only can contains number").isNumeric(),
	check("price", "Price too high").isLength({ max: 13 }),
	// description
	check("description", "Description maximum length is 500 characters").isLength({ max: 500 }),
	// stock
	check("stock", "Stock required").not().isEmpty(),
	check("stock", "Stock only can contains number").isNumeric(),
	check("stock", "Stock too much").isLength({ max: 8 }),
];

module.exports = {
	insert,
};
