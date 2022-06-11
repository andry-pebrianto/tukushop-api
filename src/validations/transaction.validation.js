const { check } = require("express-validator");

const insert = [
	// paymentMethod
	check("paymentMethod", "Payment Method required").not().isEmpty(),
	// city
	check("city", "City required").not().isEmpty(),
	// postalCode
	check("postalCode", "Postal Code required").not().isEmpty(),
	check("postalCode", "Postal Code only can contains number").isNumeric(),
	// address
	check("address", "Address required").not().isEmpty(),
	// price
	check("price", "Price required").not().isEmpty(),
	// qty
	check("qty", "Quantity required").not().isEmpty(),
	// recipientPhone
	check("recipientPhone", "Recipient Phone required").not().isEmpty(),
	// recipientName
	check("recipientName", "Recipient Name required").not().isEmpty(),
];

module.exports = {
	insert,
};
