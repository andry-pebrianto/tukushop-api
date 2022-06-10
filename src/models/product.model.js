const db = require("../config/db");

module.exports = {
	insertProduct: (body) =>
		new Promise((resolve, reject) => {
			const {
				id,
				storeId,
				categoryId,
				productName,
				brandId,
				price,
				description,
				stock,
				rating,
				date,
				isActive,
			} = body;

			db.query(
				"INSERT INTO product (id, store_id, category_id, product_name, brand_id, price, description, stock, rating, date, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
				[
					id,
					storeId,
					categoryId,
					productName,
					brandId,
					price,
					description,
					stock,
					rating,
					date,
					isActive,
				],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	insertProductPhoto: (data) =>
		new Promise((resolve, reject) => {
			const {id, productId, photo} = data;

			db.query(
				"INSERT INTO product_images (id, product_id, photo) VALUES ($1, $2, $3) RETURNING id",
				[
					id,
					productId,
					photo,
				],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	insertProductSizes: (data) =>
		new Promise((resolve, reject) => {
			const {id, productId, size} = data;

			db.query(
				"INSERT INTO product_sizes (id, product_id, size) VALUES ($1, $2, $3) RETURNING id",
				[
					id,
					productId,
					size
				],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
	insertProductColors: (data) =>
		new Promise((resolve, reject) => {
			const {id, productId, colorName, colorValue} = data;

			db.query(
				"INSERT INTO product_color (id, product_id, color_name, color_value) VALUES ($1, $2, $3, $4) RETURNING id",
				[
					id,
					productId,
					colorName,
					colorValue,
				],
				(error, result) => {
					if (error) {
						reject(error);
					}
					resolve(result);
				}
			);
		}),
};
