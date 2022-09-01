import Chat from '../models/chat.js';
import User from '../models/user.js';

export const chatCreate = (socket) => {
	return async (chatId) => {
		try {
			const chat = await Chat.findById(chatId);
			const {avatar} = await User.findById(chat.creator);
			socket.broadcast.emit('chat created', {chatId: chat._id, chatName: chat.name, creatorAvatar: avatar});		
		} catch(e) {
			socket.broadcast.emit('error occurred');
		}
	};
};

export const chatDeleted = (socket) => {
	return (chatId) => {
		socket.broadcast.emit('chat deleted', chatId);		
	};
};

export const sendMessage = (socket) => {
	return async (chatId) => {
		try {
			const chat = await Chat.findById(chatId);
			const newMessage = chat.messages[chat.messages.length-1];
			const author = await User.findById(newMessage.author);
			let admin = '';
			if (`${author._id}` == `${chat.creator}`)
				admin = 'admin';
			socket.broadcast.to(chatId).emit('message sent', {
				admin,
				authorName: author.name,
				authorAvatar: author.avatar,
				content: newMessage.content			
			});
		} catch(e) {
			socket.broadcast.to(chatId).emit('error occurred');
		}
	};
};

export const chatRenamed = (socket) => {
	return ({chatId, newName}) => {
		socket.to(chatId).emit('chat renamed', {newName});
	};	
};

export const deleteChat = (socket) => {
	return (chatId) => {
		socket.broadcast.to(chatId).emit('deleted chat');
	};	
};
