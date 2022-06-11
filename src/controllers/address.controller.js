const { success, failed } = require("../helpers/response");
const addressModel = require("../models/address.model");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  addAddress: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const {
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimary,
      } = req.body;

      // cek apakah user pernah buat address apa belom
      const addressUserData = await addressModel.checkUserAddressData(userId);

      // mengubah value is primary jika pertama input address dari false ke true
      let isPrimaryValue;
      // jika belum ada set primary ke true
      if (isPrimary == false && addressUserData.rowCount == 0) {
        isPrimaryValue = true;
        // jika sudah ada dan input true set semua address miliknya jadi primary false
      } else if (isPrimary == true && addressUserData.rowCount > 0) {
        isPrimaryValue = true;
        const falseValue = false;
        await addressModel.changeAllMyAddressPrimaryFalse(userId, falseValue);
      } else {
        isPrimaryValue = isPrimary;
      }
      // catch all data
      const id = uuidv4();
      const data = {
        id,
        userId,
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimaryValue,
      };
      await addressModel.addAddressData(data);
      success(res, {
        code: 200,
        status: "success",
        message: "success add new address",
        data: data,
        paggination: [],
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "error",
        message: error.message,
        error: [],
      });
      return;
    }
  },
  myAddress: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const data = await addressModel.myAddressData(userId);
      if (data.rowCount == 0) {
        const err = {
          message: `data not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      success(res, {
        code: 200,
        status: "success",
        message: "success get my address",
        data: data.rows,
        paggination: [],
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "error",
        message: error.message,
        error: [],
      });
      return;
    }
  },
  updateMyAddress: async (req, res) => {
    try {
      const userId = req.APP_DATA.tokenDecoded.id;
      const id = req.params.id;
      const {
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimary,
      } = req.body;

      // cek apakah benar ini address dia
      const addressDetail = await addressModel.detailAddressData(id);
      //cek apakah adress dgn id ada
      if (addressDetail.rowCount == 0) {
        const err = {
          message: `data not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      // cek user id addresss
      if (addressDetail.rows[0].user_id != userId) {
        const err = {
          message: `its not your address`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      // cek apakah address id ini adalah address primary atau bukan
      const dataPrimary = await addressModel.checkUserAddressIsPrimary(userId);
      if (
        dataPrimary.rows[0].id == addressDetail.rows[0].id &&
        isPrimary == false
      ) {
        const err = {
          message: `cannot update the address to not primary please set another address to primary first`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      // jika input is primary true
      let isPrimaryValue;
      if (isPrimary == true) {
        isPrimaryValue = true;
        const falseValue = false;
        await addressModel.changeAllMyAddressPrimaryFalse(userId, falseValue);
      } else {
        primaryvalue = false;
      }
      // catch all data
      const data = {
        id,
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimaryValue,
      };
      await addressModel.updateAddressData(data);
      success(res, {
        code: 200,
        status: "success",
        message: "success updated address",
        data: data,
        paggination: [],
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "error",
        message: error.message,
        error: [],
      });
      return;
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.APP_DATA.tokenDecoded.id;

      // cek apakah benar ini address dia
      const addressDetail = await addressModel.detailAddressData(id);
      //cek apakah adress dgn id ada
      if (addressDetail.rowCount == 0) {
        const err = {
          message: `data not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      // cek user id addresss
      if (addressDetail.rows[0].user_id != userId) {
        const err = {
          message: `its not your address`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      // cek apakah address id ini adalah address primary atau bukan
      const dataPrimary = await addressModel.checkUserAddressIsPrimary(userId);
      if (dataPrimary.rows[0].id == addressDetail.rows[0].id) {
        const err = {
          message: `cannot delete the primary address ,please set another address to primary first`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      await addressModel.deleteAddressData(id);
      success(res, {
        code: 200,
        status: "success",
        message: `Success delete address`,
        data: addressDetail.rows[0],
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "error",
        message: error.message,
        error: [],
      });
      return;
    }
  },
};
