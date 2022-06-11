const { success, failed } = require("../helpers/response");
const productBrandModel = require("../models/productBrand.model");
const deleteFile = require("../utils/deleteFile");
const { v4: uuidv4 } = require("uuid");
const uploadGoogle = require("../helpers/uploadGoogleDrive");
const deleteGoogle = require("../helpers/deleteGoogleDrive");

module.exports = {
  allProductBrand: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || "";
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : "brand_name";
      const modeQuery = mode ? mode : "ASC";
      const allData = await productBrandModel.allProductBrand();
      const totalData = Number(allData.rows[0].total);
      const data = {
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
      };

      const dataProductBrand = await productBrandModel.allProductBrandData(
        data
      );
      if (dataProductBrand.rowCount === 0) {
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
      if (search) {
        const pagination = {
          currentPage: pageValue,
          dataPerPage:
            limitValue > dataProductBrand.rowCount
              ? dataProductBrand.rowCount
              : limitValue,
          totalPage: Math.ceil(dataProductBrand.rowCount / limitValue),
        };
        success(res, {
          code: 200,
          status: "success",
          message: `Success get data product brand`,
          data: dataProductBrand.rows,
          pagination: pagination,
        });
      } else {
        const pagination = {
          currentPage: pageValue,
          dataPerPage:
            limitValue > dataProductBrand.rowCount
              ? dataProductBrand.rowCount
              : limitValue,
          totalPage: Math.ceil(totalData / limitValue),
        };

        success(res, {
          code: 200,
          status: "success",
          message: `Success get data product brand`,
          data: dataProductBrand.rows,
          pagination: pagination,
        });
      }
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
  allProductBrandActive: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || "";
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : "brand_name";
      const modeQuery = mode ? mode : "ASC";
      const allData = await productBrandModel.allProductBrandActive();
      const totalData = Number(allData.rows[0].total);
      const data = {
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
      };

      const dataProductBrandActive =
        await productBrandModel.allProductBrandActiveData(data);
      if (dataProductBrandActive.rowCount === 0) {
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
      if (search) {
        const pagination = {
          currentPage: pageValue,
          dataPerPage:
            limitValue > dataProductBrandActive.rowCount
              ? dataProductBrandActive.rowCount
              : limitValue,
          totalPage: Math.ceil(dataProductBrandActive.rowCount / limitValue),
        };
        success(res, {
          code: 200,
          status: "success",
          message: `Success get data product brand`,
          data: dataProductBrandActive.rows,
          pagination: pagination,
        });
      } else {
        const pagination = {
          currentPage: pageValue,
          dataPerPage:
            limitValue > dataProductBrandActive.rowCount
              ? dataProductBrandActive.rowCount
              : limitValue,
          totalPage: Math.ceil(totalData / limitValue),
        };

        success(res, {
          code: 200,
          status: "success",
          message: `Success get data product brand`,
          data: dataProductBrandActive.rows,
          pagination: pagination,
        });
      }
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
  detailProductBrand: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await productBrandModel.detailProductBrandData(id);
      if (data.rowCount == 0) {
        const err = {
          message: `Product brand with id ${id} not found`,
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
        message: `Success get Category with id ${id}`,
        data: data.rows[0],
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
  addProductBrand: async (req, res) => {
    try {
      const { brandName } = req.body;
      if (!req.file) {
        const err = {
          message: "photo is required",
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      // for check name
      const productNameCheck = await productBrandModel.productBrandNameCheck(
        brandName
      );
      if (productNameCheck.rowCount > 0) {
        deleteFile(`public/${req.file.filename}`);
        const err = {
          message: "name is already exist",
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }

      let photo = "";
      if (req.file) {
        const photoGd = await uploadGoogle(req.file);
        photo = photoGd.id;
        deleteFile(`public/${req.file.filename}`);
      }
      const id = uuidv4();
      const isActive = true;
      const data = {
        id,
        brandName,
        photo,
        isActive,
      };
      await productBrandModel.addProductBrandData(data);
      success(res, {
        code: 200,
        status: "success",
        message: "create brand success",
        data: data,
        paggination: [],
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "error",
        message: err.message,
        error: [],
      });
      return;
    }
  },
  updateProductBrand: async (req, res) => {
    try {
      const id = req.params.id;
      const { brandName } = req.body;
      let photo;
      // cek id
      const productBrandDetail = await productBrandModel.detailProductBrandData(
        id
      );
      if (productBrandDetail.rowCount == 0) {
        if (req.file) {
          deleteFile(`public/${req.file.filename}`);
        }
        const err = {
          message: `product brand with id ${id} not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      // cek brand name sama atau tidak dengan yang lama
      if (brandName != productBrandDetail.rows[0].brand_name) {
        const productNameCheck = await productBrandModel.productBrandNameCheck(
          brandName
        );
        // cek apakah ada data dengan nama yang sama
        if (productNameCheck.rowCount > 0) {
          // cek apakah upload file
          if (req.file) {
            deleteFile(`public/${req.file.filename}`);
          }
          const err = {
            message: "Name is already exist",
          };
          failed(res, {
            code: 500,
            status: "error",
            message: err.message,
            error: [],
          });
          return;
        }
      }

      // cek apakah upload photo
      if (req.file) {
        if (productBrandDetail.rows[0].photo) {
          await deleteGoogle(productBrandDetail.rows[0].photo);
        }
        const photoGd = await uploadGoogle(req.file);
        photo = photoGd.id;
        deleteFile(`public/${req.file.filename}`);
      } else {
        photo = productBrandDetail.rows[0].photo;
      }

      const data = {
        id,
        brandName,
        photo,
      };
      await productBrandModel.updateProductBrandData(data);
      success(res, {
        code: 200,
        status: "success",
        message: `update product brand success`,
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
    }
  },
  statusProductBrand: async (req, res) => {
    try {
      const id = req.params.id;
      const { isActive } = req.body;
      const data = {
        id,
        isActive,
      };
      const active = await productBrandModel.detailProductBrandData(id);
      if (active.rowCount == 0) {
        const err = {
          message: `id ${id} not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      if (isActive == true && active.rows[0].is_active == true) {
        const err = {
          message: `product brand with id ${id} is already active`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      if (isActive == false && active.rows[0].is_active == false) {
        const err = {
          message: `product brand with id ${id} is already nonactive`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      await productBrandModel.statusProductBrandData(data);
      const updated = await productBrandModel.detailProductBrandData(id);
      success(res, {
        code: 200,
        status: "success",
        message: `update status category success`,
        data: updated.rows[0],
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
  deleteProductBrand: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await productBrandModel.detailProductBrandData(id);
      if (data.rowCount == 0) {
        const err = {
          message: `product brand with id ${id} not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      if (data.rows[0].is_active == true) {
        const err = {
          message: `set product brand status inactive first`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      await productBrandModel.deleteProductBrandData(id);
      await deleteGoogle(data.rows[0].photo);
      success(res, {
        code: 200,
        status: "success",
        message: `delete product successfully`,
        data: data.rows[0],
        paggination: [],
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "error",
        message: err.message,
        error: [],
      });
      return;
    }
  },
};
