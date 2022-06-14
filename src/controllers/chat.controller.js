const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const { success, failed } = require("../helpers/response");

module.exports = {
	insertInitialChat: async (req, res) => {
		try {
			const {senderId, receiverId} = req.body;

			const store = await userModel.findStoreBy("id", receiverId);
			const user = await userModel.findBy("id", store.rows[0].user_id);

			await chatModel.insertChat(senderId, user.rows[0].id, "Halo, selamat siang.");

			success(res, {
				code: 200,
				status: "success",
				data: null,
				message: "Insert Chat Success",
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
