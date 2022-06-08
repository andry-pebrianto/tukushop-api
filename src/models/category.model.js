const db = require("../config/db");

const categoryModel = {
  allCategory: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total from categories`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  allCategoryActive: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT COUNT(*) AS total from categories WHERE is_active=true`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  allCategoryData: (data) => {
    return new Promise((resolve, reject) => {
      const { searchQuery, offsetValue, limitValue, sortQuery, modeQuery } =
        data;
      db.query(
        `SELECT * FROM categories WHERE LOWER(category_name) LIKE LOWER ('%${searchQuery}%') ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
  allCategoryActiveData: (data) => {
    return new Promise((resolve, reject) => {
      const { searchQuery, offsetValue, limitValue, sortQuery, modeQuery } =
        data;
      db.query(
        `SELECT * FROM categories WHERE LOWER(category_name) LIKE LOWER ('%${searchQuery}%') 
        AND is_active=true ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
  detailCategoryData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM categories WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  categoryNameCheck: (categoryName) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM categories WHERE category_name='${categoryName}'`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
  addCategoryData: (data) => {
    const { id, categoryName, photo, isActive } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO categories(id,category_name,photo,is_active)
      VALUES('${id}','${categoryName}','${photo}','${isActive}')`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  updateCategoryData: (data) => {
    return new Promise((resolve, reject) => {
      const { id, categoryName, photo } = data;
      db.query(
        `UPDATE categories SET category_name='${categoryName}', photo='${photo}' WHERE id='${id}'`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
  statusCategoryData: (data) => {
    return new Promise((resolve, reject) => {
      const { id, isActive } = data;
      db.query(
        `UPDATE categories SET is_active=${isActive} WHERE id='${id}'`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  deleteCategorydata: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM categories WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
};

module.exports = categoryModel;
