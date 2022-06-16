const { v4: uuidv4 } = require("uuid");
const { success, failed } = require("../helpers/response");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const deleteFile = require("../helpers/deleteFile");
const uploadGoogleDrive = require("../helpers/uploadGoogleDrive");
const deleteGoogleDrive = require("../helpers/deleteGoogleDrive");
const createPagination = require("../helpers/createPagination");

module.exports = {
	listProduct: async (req, res) => {
		try {
			const {
				page,
				limit,
				search = "",
				sort = "",
				categoryFilter,
				colorFilter,
				sizeFilter
			} = req.query;
			const count = await productModel.countProduct(search);
			const paging = createPagination(count.rowCount, page, limit);
			let products = await productModel.selectListProduct(
				paging,
				search,
				sort,
				categoryFilter
			);

			// get product_image, product_size, product_color
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(
					products.rows[i].id
				);
				const productSizes = await productModel.selectAllProductSize(
					products.rows[i].id
				);
				const productColors = await productModel.selectAllProductColor(
					products.rows[i].id
				);

				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}

			// filter color
			if (colorFilter) {
				products.rows = products.rows.filter((product) => {
					const colorArray = [];
					product.product_color.forEach((item) => {
						colorArray.push(item.color_name);
					});

					return colorArray.includes(colorFilter);
				});
			}

			// filter size
			if (sizeFilter) {
				products.rows = products.rows.filter((product) => {
					const sizeArray = [];
					product.product_sizes.forEach((item) => {
						sizeArray.push(item.size);
					});

					return sizeArray.includes(parseInt(sizeFilter));
				});
			}

			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select List Product Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	listProductByCategory: async (req, res) => {
		try {
			const { id: categoryId } = req.params;

			const { page, limit, search = "", sort = "" } = req.query;
			const count = await productModel.countProductByCategory(
				categoryId,
				search
			);
			const paging = createPagination(count.rowCount, page, limit);
			const products = await productModel.selectListProductByCategory(
				categoryId,
				paging,
				search,
				sort
			);

			// get product_image, product_size, product_color
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(
					products.rows[i].id
				);
				const productSizes = await productModel.selectAllProductSize(
					products.rows[i].id
				);
				const productColors = await productModel.selectAllProductColor(
					products.rows[i].id
				);

				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}

			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select List Product By Category Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	detailProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.detailProduct(id);

			// jika product tidak ditemukan
			if (!product.rowCount) {
				failed(res, {
					code: 404,
					status: "error",
					message: "Select Detail Product Failed",
					error: `Product with Id ${id} not found`,
				});
				return;
			}

			const productImages = await productModel.selectAllProductImage(
				product.rows[0].id
			);
			const productSizes = await productModel.selectAllProductSize(
				product.rows[0].id
			);
			const productColors = await productModel.selectAllProductColor(
				product.rows[0].id
			);

			product.rows[0].product_images = productImages.rows;
			product.rows[0].product_sizes = productSizes.rows;
			product.rows[0].product_color = productColors.rows;

			success(res, {
				code: 200,
				status: "success",
				data: product.rows[0],
				message: "Select Detail Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	listMyProduct: async (req, res) => {
		try {
			const id = req.APP_DATA.tokenDecoded.id;
			const { page, limit, search = "", sort = "" } = req.query;

			const store = await userModel.findStoreBy("user_id", id);
			const storeId = store.rows[0].id;
			const count = await productModel.countProductById(storeId, search);
			const paging = createPagination(count.rowCount, page, limit);
			const products = await productModel.selectListProductById(
				storeId,
				paging,
				search,
				sort
			);

			// get product_image, product_size, product_color
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(
					products.rows[i].id
				);
				const productSizes = await productModel.selectAllProductSize(
					products.rows[i].id
				);
				const productColors = await productModel.selectAllProductColor(
					products.rows[i].id
				);

				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}

			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select List My Product Success",
				pagination: paging.response,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	newProduct: async (req, res) => {
		try {
			const products = await productModel.selectNewProduct();

			// get product_image, product_size, product_color
			for (let i = 0; i < products.rows.length; i++) {
				const productImages = await productModel.selectAllProductImage(
					products.rows[i].id
				);
				const productSizes = await productModel.selectAllProductSize(
					products.rows[i].id
				);
				const productColors = await productModel.selectAllProductColor(
					products.rows[i].id
				);

				products.rows[i].product_images = productImages.rows;
				products.rows[i].product_sizes = productSizes.rows;
				products.rows[i].product_color = productColors.rows;
			}

			success(res, {
				code: 200,
				status: "success",
				data: products.rows,
				message: "Select New Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	addProduct: async (req, res) => {
		try {
			const {
				storeId,
				categoryId,
				brandId,
				productName,
				price,
				description,
				stock,
				productSizes,
				productColors,
				isNew,
			} = req.body;

			// insert product
			const productData = await productModel.insertProduct({
				id: uuidv4(),
				storeId,
				categoryId,
				brandId,
				productName,
				price,
				description,
				stock,
				rating: 8,
				date: new Date(),
				isActive: true,
				isNew,
			});

			// insert photo
			if (req.files) {
				if (req.files.photo) {
					req.files.photo.map(async (item) => {
						// upload photo baru ke gd
						const photoGd = await uploadGoogleDrive(item);
						await productModel.insertProductPhoto({
							id: uuidv4(),
							productId: productData.rows[0].id,
							photo: photoGd.id,
						});
						// menghapus photo setelah diupload ke gd
						deleteFile(item.path);
					});
				}
			}

			// insert product sizes
			if(productSizes) {
				JSON.parse(productSizes).map(async (size) => {
					await productModel.insertProductSizes({
						id: uuidv4(),
						productId: productData.rows[0].id,
						size,
					});
				});
			}

			// insert product colors
			if(productColors) {
				JSON.parse(productColors).map(async (color) => {
					await productModel.insertProductColors({
						id: uuidv4(),
						productId: productData.rows[0].id,
						colorName: color.colorName,
						colorValue: color.colorValue,
					});
				});
			}

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Insert New Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	editProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.detailProduct(id);

			// jika product tidak ditemukan
			if (!product.rowCount) {
				failed(res, {
					code: 404,
					status: "error",
					message: "Edit Product Failed",
					error: `Product with Id ${id} not found`,
				});
				return;
			}

			const {
				categoryId,
				brandId,
				productName,
				price,
				description,
				stock,
				productSizes,
				productColors,
				isNew,
			} = req.body;

			// insert product
			await productModel.updateProduct(id, {
				categoryId,
				brandId,
				productName,
				price,
				description,
				stock,
				isNew,
			});

			// insert photo
			if (req.files) {
				if (req.files.photo) {
					req.files.photo.map(async (item) => {
						// upload photo baru ke gd
						const photoGd = await uploadGoogleDrive(item);
						await productModel.insertProductPhoto({
							id: uuidv4(),
							productId: product.rows[0].id,
							photo: photoGd.id,
						});
						// menghapus photo setelah diupload ke gd
						deleteFile(item.path);
					});
				}
			}

			// delete all sizes product have
			await productModel.deleteAllProductSizes(product.rows[0].id);
			// insert product sizes
			productSizes.map(async (size) => {
				await productModel.insertProductSizes({
					id: uuidv4(),
					productId: product.rows[0].id,
					size,
				});
			});

			// delete all color product have
			await productModel.deleteAllProductColors(product.rows[0].id);
			// insert product colors
			productColors.map(async (color) => {
				await productModel.insertProductColors({
					id: uuidv4(),
					productId: product.rows[0].id,
					colorName: color.colorName,
					colorValue: color.colorValue,
				});
			});

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Edit Product Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	disableProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await productModel.findBy("id", id);

			// jika product tidak ditemukan
			if (!product.rowCount) {
				failed(res, {
					code: 404,
					status: "error",
					message: "Disable Or Enable Product Failed",
					error: `Product with Id ${id} not found`,
				});
				return;
			}

			await productModel.disableOrEnable(id, !product.rows[0].is_active);

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: `${
					product.rows[0].is_active ? "Disable" : "Enable"
				} Product Success`,
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
	removeProductPhoto: async (req, res) => {
		try {
			const { id } = req.params;

			const product = await productModel.detailPhoto(id);
			await productModel.deleteProductPhoto(id);

			if (product.rowCount) {
				await deleteGoogleDrive(product.rows[0].photo);
			}

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Delete Product Photo Success",
			});
		} catch (error) {
			failed(res, {
				code: 500,
				status: "error",
				message: "Internal Server Error",
				error: error.message,
			});
		}
	},
};
