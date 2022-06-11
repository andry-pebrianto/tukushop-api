const { check } = require("express-validator");

const createValidation = [
  // label
  check("label", "Label cannot be empty").not().isEmpty(),

  // recipient name
  check("recipientName", "Recipient name cannot be empty").not().isEmpty(),
  check("recipientName", "Recipient name cannot be empty").not().isEmpty(),
  check("recipientName", "Recipient name only can contains alphabet").isAlpha(
    "en-US",
    {
      ignore: " ",
    }
  ),

  // recipient phone
  check("recipientPhone", "Recipient phone cannot be empty").not().isEmpty(),
  check(
    "recipientPhone",
    "Insert a valid phone number at recipient phone"
  ).isMobilePhone(),

  // address
  check("address", "Address cannot be empty").not().isEmpty(),

  // postalcode
  check("postalCode", "Postal code cannot be empty").not().isEmpty(),
  check("postalCode", "Postal code must be a valid post code").isPostalCode(
    "ID"
  ),

  // city
  check("city", "City cannot be empty").not().isEmpty(),
  check("city", "City only can contains alphabet").isAlpha("en-US", {
    ignore: " ",
  }),

  // isPrimary
  check("isPrimary", "Is primary cannot be empty").not().isEmpty(),
  check("isPrimary", "Is primary value must be boolean").isBoolean(),
];
const updateValidation = [
  // label
  check("label", "Label cannot be empty").not().isEmpty(),

  // recipient name
  check("recipientName", "Recipient name cannot be empty").not().isEmpty(),
  check("recipientName", "Recipient name cannot be empty").not().isEmpty(),
  check("recipientName", "Recipient name only can contains alphabet").isAlpha(
    "en-US",
    {
      ignore: " ",
    }
  ),

  // recipient phone
  check("recipientPhone", "Recipient phone cannot be empty").not().isEmpty(),
  check(
    "recipientPhone",
    "Insert a valid phone number at recipient phone"
  ).isMobilePhone(),

  // address
  check("address", "Address cannot be empty").not().isEmpty(),

  // postalcode
  check("postalCode", "Postal code cannot be empty").not().isEmpty(),
  check("postalCode", "Postal code must be a valid post code").isPostalCode(
    "ID"
  ),

  // city
  check("city", "City cannot be empty").not().isEmpty(),
  check("city", "City only can contains alphabet").isAlpha("en-US", {
    ignore: " ",
  }),

  // isPrimary
  check("isPrimary", "Is primary cannot be empty").not().isEmpty(),
  check("isPrimary", "Is primary value must be boolean").isBoolean(),
];

module.exports = {
  createValidation,
  updateValidation,
};
