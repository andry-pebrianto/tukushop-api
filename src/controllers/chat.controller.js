const chatModel = require("../models/chat.model");
const { success, failed } = require("../helpers/response");

module.exports = {
	insertInitialChat: async (req, res) => {
		try {
			const {senderId, receiverId} = req.body;
			await chatModel.insertChat(senderId, receiverId, "Halo, selamat siang.");

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
