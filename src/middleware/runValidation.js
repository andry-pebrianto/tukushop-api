const { validationResult } = require("express-validator");
const { failed } = require("../helpers/response");
const deleteFile = require("../utils/deleteFile");
module.exports = (req, res, next) => {
  try {
    const errors = validationResult(req).array({ onlyFirstError: true });

    // jika validasi gagal
    if (errors.length) {
      if (req.file) {
        deleteFile(`public/${req.file.filename}`);
      }

      failed(res, {
        code: 400,
        status: "failed",
        message: "Validation Failed",
        error: errors,
      });
      return;
    }

    next();
  } catch (error) {
    failed(res, {
      code: 500,
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
