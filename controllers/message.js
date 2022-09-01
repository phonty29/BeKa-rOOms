import Chat from '../models/chat.js';
import User from '../models/user.js';

class MessageController {
	async sendMessage(req, res) {
		try {
			const session = req.session;
			const chatId = req.params.id;
			let chat = await Chat.findById(chatId);
			if (!chat) {
				return res.redirect(301, '/chats');
			}
			const newMessage = {
				author: session.user_id,
				content: req.body.content
			};
			chat = await Chat.findByIdAndUpdate(chatId, {messages: [...chat.messages, newMessage]}, {new: true});
			return res.status(200).json({message: 'A message succesfully delivered'});
		} catch(e) {
			res.status(500).json(e);
		}			
	}	
}

export default new MessageController();


