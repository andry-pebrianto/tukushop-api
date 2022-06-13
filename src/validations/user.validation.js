const { check } = require("express-validator");

const register = [
	// name
	check("name", "Name required").not().isEmpty(),
	check("name", "Name only can contains alphabet").isAlpha("en-US", {
		ignore: " ",
	}),
	check("name", "Name maximum length is 100 characters").isLength({ max: 100 }),
];

const buyer = [
	...register,
	// phone
	check("phone", "Phone only can contains number").isNumeric(),
	check("phone", "Phone maximum length is 13 characters").isLength({ max: 13 }),
];

const seller = [
	...register,
	// storeName
	check("storeName", "Store Name required").not().isEmpty(),
	check("storeName", "Store Name maximum length is 100 characters").isLength({
		max: 100,
	}),
	// storePhone
	check("storePhone", "Store phone only can contains number").isNumeric(),
	check("storePhone", "Store phone maximum length is 13 characters").isLength({ max: 13 }),
	// storeDescription
	check("storeDescription", "Store description maximum length is 250 characters").isLength({ max: 250 }),
];

module.exports = {
	buyer,
	seller,
};
