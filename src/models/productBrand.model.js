const db = require("../config/db");
const productBrandModel = {
  productBrandNameCheck: (brandName) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM product_brands WHERE brand_name='${brandName}'`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  allProductBrand: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total from product_brands`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  allProductBrandData: (data) => {
    return new Promise((resolve, reject) => {
      const { searchQuery, offsetValue, limitValue, sortQuery, modeQuery } =
        data;
      db.query(
        `SELECT * FROM product_brands WHERE LOWER(brand_name) LIKE LOWER ('%${searchQuery}%') ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
  allProductBrandActive: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT COUNT(*) AS total from product_brands WHERE is_active=true`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  allProductBrandActiveData: (data) => {
    return new Promise((resolve, reject) => {
      const { searchQuery, offsetValue, limitValue, sortQuery, modeQuery } =
        data;
      db.query(
        `SELECT * FROM product_brands WHERE LOWER(brand_name) LIKE LOWER ('%${searchQuery}%')
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
  detailProductBrandData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM product_brands WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  addProductBrandData: (data) => {
    const { id, brandName, photo, isActive } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO product_brands(id, brand_name, photo, is_active)
        VALUES('${id}','${brandName}','${photo}','${isActive}')
        `,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  updateProductBrandData: (data) => {
    const { id, brandName, photo } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
        UPDATE product_brands SET brand_name='${brandName}', photo='${photo}' WHERE id='${id}'
        `,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  statusProductBrandData: (data) => {
    return new Promise((resolve, reject) => {
      const { id, isActive } = data;
      db.query(
        `UPDATE product_brands SET is_active=${isActive} WHERE id='${id}'`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  deleteProductBrandData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM product_brands WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
};

module.exports = productBrandModel;
