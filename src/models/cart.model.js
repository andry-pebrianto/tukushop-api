const db = require("../config/db");

const cartModel = {
	getProductDetail: (productId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      SELECT * FROM product WHERE id='${productId}'
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
	addCartData: (data) => {
		const { id, userId, productId, qty } = data;
		return new Promise((resolve, reject) => {
			db.query(
				`
      INSERT INTO cart(id,user_id,product_id,qty)
      VALUES('${id}','${userId}','${productId}',${qty})
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
	myCartData: (userId) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      SELECT cart.id AS cartId ,cart.user_id AS cartUserId,cart.product_id AS cartProductId,cart.qty AS cartQty,
      product.id AS productId, product.product_name AS productName, product.price AS productPrice,
      product_images.id AS productImagesId, product_images.photo AS productImagesPhoto,
      store.id AS storeId, store_name AS storeName
      FROM cart
      INNER JOIN product ON cart.product_id = product.id
      INNER JOIN product_images ON product_images.product_id = product.id
      INNER JOIN store ON product.store_id = store.id
      WHERE cart.user_id='${userId}'
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
	detailCartData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      SELECT * FROM cart WHERE id='${id}'
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
	deleteCartData: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM cart WHERE id='${id}'`, (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	},
};

module.exports = cartModel;
