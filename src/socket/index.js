// const chatModel = require("../models/chat.model");
module.exports = (io, socket) => {
	socket.on("ping", (data) => {
		socket.emit("ping-response", data);
	});
	socket.on("join-room", (id) => {
		// join ke ruangan nya sendiri
		socket.join(id);
	});
	// socket.on("delete-message", async (data) => {
	// 	const { sender, receiver, idmessage } = data;
	// 	chatModel.deleteChat(idmessage, sender)
	// 		.then(async () => {
	// 			const listChats = await chatModel.listChat(sender, receiver);
	// 			io.to(sender).emit("send-message-response", listChats.rows);
	// 			io.to(receiver).emit("send-message-response", listChats.rows);
	// 		});
	// });
	// socket.on("send-message", (data) => {
	// 	const { sender_id, receiver_id, type, message} = data;
	// 	chatModel.insertChat(sender_id, receiver_id, type, message)
	// 		.then(async () => {
	// 			const listChats = await chatModel.listChat(sender_id, receiver_id);
	// 			// kirim pesan ke ruangan orang lain
	// 			io.to(receiver_id).emit("send-message-response", listChats.rows);
	// 			io.to(sender_id).emit("send-message-response", listChats.rows);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// });
	// socket.on("chat-history", async (data) => {
	// 	const { sender, receiver } = data;
	// 	const listChats = await chatModel.listChat(sender, receiver);
	// 	io.to(sender).emit("send-message-response", listChats.rows);
	// });
};