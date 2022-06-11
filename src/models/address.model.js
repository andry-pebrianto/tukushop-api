const db = require("../config/db");

const addressModel = {
  checkUserAddressData: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM address WHERE user_id ='${userId}' 
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
  checkUserAddressIsPrimary: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM address WHERE user_id ='${userId}' AND is_primary=true 
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
  changeAllMyAddressPrimaryFalse: (userId, falseValue) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      UPDATE address SET is_primary=${falseValue} WHERE user_id='${userId}'
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
  addAddressData: (data) => {
    return new Promise((resolve, reject) => {
      const {
        id,
        userId,
        label,
        recipientName,
        recipientPhone,
        address,
        postalCode,
        city,
        isPrimaryValue,
      } = data;
      db.query(
        `
        INSERT INTO address(id,user_id,label,recipient_name,recipient_phone,address,postal_code,city,is_primary)
        VALUES('${id}','${userId}','${label}','${recipientName}','${recipientPhone}','${address}',${postalCode},'${city}',${isPrimaryValue})
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
  myAddressData: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT * FROM address WHERE user_id='${userId}'
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
  detailAddressData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM address WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  updateAddressData: (data) => {
    const {
      id,
      label,
      recipientName,
      recipientPhone,
      address,
      postalCode,
      city,
      isPrimaryValue,
    } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `
    UPDATE address SET label='${label}',recipient_name='${recipientName}',
    recipient_phone='${recipientPhone}',address='${address}',postal_code='${postalCode}',
    city='${city}',is_primary='${isPrimaryValue}' WHERE id='${id}'
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
  deleteAddressData: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM address WHERE id='${id}'`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
};

module.exports = addressModel;
