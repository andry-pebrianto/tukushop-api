const db = require("../config/db");

const chatModel = {
	insertChat: (sender, receiver, message) => {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO chat (sender, receiver, message) VALUES ($1, $2, $3)", [sender, receiver, message], (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},
	deleteChat: (id, senderId) => {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM chat WHERE id=$1 AND sender=$2", [id, senderId], (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},
	listChat: (senderId, receiverId) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT 
      chat.id, 
      chat.message, 
      chat.date, 
      userSender.id AS sender_id, 
      userReceiver.id AS receiver_id 
      FROM chat
      INNER JOIN users AS userSender ON chat.sender=userSender.id
      INNER JOIN users AS userReceiver ON chat.receiver=userReceiver.id
      WHERE (sender = '${senderId}' AND receiver = '${receiverId}') 
      OR (sender = '${receiverId}' AND receiver = '${senderId}')`, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},
};
module.exports = chatModel;