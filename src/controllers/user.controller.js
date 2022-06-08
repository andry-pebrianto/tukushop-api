const userModel = require("../models/user.model");
const { success, failed } = require("../helpers/response");
const deleteFile = require("../helpers/deleteFile");
const deleteGoogleDrive = require("../helpers/deleteGoogleDrive");
const uploadGoogleDrive = require("../helpers/uploadGoogleDrive");

module.exports = {
	editProfileBuyer: async (req, res) => {
		try {
			const { id } = req.params;
			const { name, phone, gender, birth } = req.body;

			const user = await userModel.findBy("id", id);
			// jika user tidak ditemukan
			if (!user.rowCount) {
				if (req.file) {
					deleteFile(req.file.path);
				}

				failed(res, {
					code: 404,
					status: "failed",
					error: `User with Id ${id} not found`,
					message: "Update User Failed",
				});
				return;
			}

			let { photo } = user.rows[0];
			if (req.file) {
				if (user.rows[0].photo) {
					// menghapus photo lama dari gd
					await deleteGoogleDrive(user.rows[0].photo);
				}
				// upload photo baru ke gd
				const photoGd = await uploadGoogleDrive(req.file);
				photo = photoGd.id;
				// menghapus photo setelah diupload ke gd
				deleteFile(req.file.path);
			}

			await userModel.updateUser(id, {
				name,
				photo,
			});
			await userModel.updateProfileBuyer(id, {
				phone,
				gender,
				birth,
			});

			success(res, {
				code: 200,
				status: "success",
				message: "Edit Profile Success",
				data: null,
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
