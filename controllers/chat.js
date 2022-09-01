import Chat from '../models/chat.js';
import User from '../models/user.js';

class ChatController {
	async getChats(req, res) { 
		try {
			const session = req.session;
			const user = await User.findById(session.user_id);
			if (!user) {
				return res.redirect(301, '/auth/sign-in'); 
			}
			let chats = await Chat.find();
			if (chats.length == 0) 
				chats = [];
			else {
				chats = chats.map(async (chat, index, array) => {
					if (chat.creator == session.user_id) 
						return {chatId: chat._id, chatName: chat.name, chatIsMine: true};
					else {
						const creator = await User.findById(chat.creator);
						return {chatId: chat._id, chatName: chat.name, creatorName: creator.name, creatorAvatar: creator.avatar, chatIsMine: false}
					} 
				});
				chats = await Promise.all(chats);
			}
			res.render('chats', {user, chats});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Cannot access this page'});						
		}
	}		

	async openChat(req, res) { 
		try {
			const session = req.session;
			const chatId = req.params.id;
			const chat = await Chat.findById(chatId);
			if (!chat) {
				return res.redirect(301, '/chats');
			}
			const user = await User.findById(session.user_id);
			if (!user) {
				return res.redirect(301, '/auth/sign-in'); //if user is logged-out then i push him to sign up again
			}
			let chatIsMine = false;
			if (chat.creator == session.user_id) chatIsMine = true;
			let messages = chat.messages;
			if (messages.length == 0) messages = [];
			else {
				messages = messages.map(async (message, index, array) => {
					const author = await User.findById(message.author);
					if (author) {	//if user deleted i just miss all his messages
						return {
							authorId: author._id,
							authorName: author.name,
							authorAvatar: author.avatar,
							content: message.content
						};
					}
				});
				messages = await Promise.all(messages);
				messages = messages.filter((message) => message != undefined)
			}
			res.render('chatroom', {chat, user, messages, chatIsMine});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Cannot access this page'});						
		}		
	}

	async createChat(req, res) {
		try {
			const session = req.session;
			const chat = new Chat({
				creator: session.user_id, 
				name: req.body.name,
				members: []
			});
			await chat.save();
			return res.status(200).json({chatId: chat._id, chatName: chat.name, message: `"${req.body.name}" chat was created succesfully`});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Cannot access this page'});						
		}		
	}

	async renameChat(req, res) {
		try {
			const {chatId, newChatName} = req.body;
			if (!newChatName) {return res.status(400).json({message: 'Name should be non-empty string'});}
			const chat = await Chat.findByIdAndUpdate(chatId, {name: newChatName}, {new: true});
			if (!chat) {
				return res.redirect(301, '/chats');
			}
			return res.status(200).json({message: 'Chat name was changed', newName: newChatName});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Cannot access this page'});						
		}		
	}

	async deleteChat(req, res) {
		const chatId = req.params.id;
		const chat = await Chat.findByIdAndDelete(chatId);
		if (!chat) {
			return res.redirect(301, '/chats');
		}		
		return res.status(200).json({chatId: chat._id, message: `"${chat.name}" chat was deleted succesfully`});
	}
}

export default new ChatController();