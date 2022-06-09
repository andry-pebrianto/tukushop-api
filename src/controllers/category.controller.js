const { success, failed } = require("../helpers/response");
const categoryModel = require("../models/category.model");
const deleteFile = require("../utils/deleteFile");
const { v4: uuidv4 } = require("uuid");
const uploadGoogle = require("../helpers/uploadGoogleDrive");
const deleteGooogle = require("../helpers/deleteGoogleDrive");

module.exports = {
  addCategory: async (req, res) => {
    try {
      const { categoryName } = req.body;
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
      const categoryNameCheck = await categoryModel.categoryNameCheck(
        categoryName
      );
      if (categoryNameCheck.rowCount > 0) {
        deleteFile(`public/${req.file.filename}`);
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
        categoryName,
        photo,
        isActive,
      };
      await categoryModel.addCategoryData(data);
      success(res, {
        code: 200,
        status: "success",
        message: "create category success",
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
  allCategory: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || "";
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : "category_name";
      const modeQuery = mode ? mode : "ASC";
      const allData = await categoryModel.allCategory();
      const totalData = Number(allData.rows[0].total);
      const data = {
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
      };

      const dataCategory = await categoryModel.allCategoryData(data);
      if (dataCategory.rowCount === 0) {
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
            limitValue > dataCategory.rowCount
              ? dataCategory.rowCount
              : limitValue,
          totalPage: Math.ceil(dataCategory.rowCount / limitValue),
        };
        success(res, {
          code: 200,
          status: "success",
          message: `Success get data category`,
          data: dataCategory.rows,
          pagination: pagination,
        });
      } else {
        const pagination = {
          currentPage: pageValue,
          dataPerPage:
            limitValue > dataCategory.rowCount
              ? dataCategory.rowCount
              : limitValue,
          totalPage: Math.ceil(totalData / limitValue),
        };

        success(res, {
          code: 200,
          status: "success",
          message: `Success get data category`,
          data: dataCategory.rows,
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
  allCategoryActive: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || "";
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : "category_name";
      const modeQuery = mode ? mode : "ASC";
      const allData = await categoryModel.allCategoryActive();
      const totalData = Number(allData.rows[0].total);
      const data = {
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
      };
      const dataCategory = await categoryModel.allCategoryActiveData(data);
      if (dataCategory.rowCount === 0) {
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
            limitValue > dataCategory.rowCount
              ? dataCategory.rowCount
              : limitValue,
          totalPage: Math.ceil(dataCategory.rowCount / limitValue),
        };
        success(res, {
          code: 200,
          status: "success",
          message: `Success get data category`,
          data: dataCategory.rows,
          pagination: pagination,
        });
      } else {
        const pagination = {
          currentPage: pageValue,
          dataPerPage:
            limitValue > dataCategory.rowCount
              ? dataCategory.rowCount
              : limitValue,
          totalPage: Math.ceil(totalData / limitValue),
        };

        success(res, {
          code: 200,
          status: "success",
          message: `Success get data category`,
          data: dataCategory.rows,
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
  detailCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await categoryModel.detailCategoryData(id);
      if (data.rowCount === 0) {
        const err = {
          message: `Category with id ${id} not found`,
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
  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const { categoryName } = req.body;
      let photo;
      // cek id
      const categoryData = await categoryModel.detailCategoryData(id);
      if (categoryData.rowCount === 0) {
        deleteFile(`public/${req.file.filename}`);
        const err = {
          message: `category with id ${id} not found`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      // cek category name
      if (categoryName != categoryData.rows[0].category_name) {
        const categoryNameCheck = await categoryModel.categoryNameCheck(
          categoryName
        );
        // return console.log(categoryNameCheck);
        if (categoryNameCheck.rowCount > 0) {
          deleteFile(`public/${req.file.filename}`);
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
      // cek photo
      if (req.file) {
        if (categoryData.rows[0].photo) {
          await deleteGooogle(categoryData.rows[0].photo);
        }
        const photoGd = await uploadGoogle(req.file);
        photo = photoGd.id;
        deleteFile(`public/${req.file.filename}`);
      } else {
        photo = categoryData.rows[0].photo;
      }

      const data = {
        id,
        categoryName,
        photo,
      };
      await categoryModel.updateCategoryData(data);
      success(res, {
        code: 200,
        status: "success",
        message: `update category success`,
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
  statusCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const { isActive } = req.body;
      const data = {
        id,
        isActive,
      };
      const active = await categoryModel.detailCategoryData(id);
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
          message: `category with id ${id} is already active`,
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
          message: `category with id ${id} is already nonactive`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      await categoryModel.statusCategoryData(data);
      const updated = await categoryModel.detailCategoryData(id);
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
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await categoryModel.detailCategoryData(id);
      if (data.rowCount == 0) {
        const err = {
          message: `category with id ${id} not found`,
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
          message: `set category status inactive first`,
        };
        failed(res, {
          code: 500,
          status: "error",
          message: err.message,
          error: [],
        });
        return;
      }
      await categoryModel.deleteCategorydata(id);
      await deleteGooogle(data.rows[0].photo);
      success(res, {
        code: 200,
        status: "success",
        message: `delete category successfully`,
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
