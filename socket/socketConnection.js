import Chat from '../models/chat.js';
import User from '../models/user.js';
import { chatCreate, chatDeleted, sendMessage, chatRenamed, deleteChat } from './controllers.js';

const socketConnection = (io) => {
	io.on('connection', (socket) => {
		const enterChat = async ({chatId, username}) => {
			try {
				socket.join(chatId);
				let chat = await Chat.findById(chatId); 
				if (!chat) { return; }	
				chat = await Chat.findByIdAndUpdate(chatId, {members: [...chat.members, {socketId: socket.id, name: username}]}, {new: true});
				io.to(chatId).emit('set users', {members: chat.members});
				socket.on('disconnect', async () => {
					chat = await Chat.findById(chatId);		
					if (!chat) { return; }	
					chat = await Chat.findByIdAndUpdate(chatId, {members: chat.members.filter((member) => {if(member.socketId != socket.id) return member})}, {new: true});
					socket.to(chatId).emit('set users', {members: chat.members});
				});
			} catch(e) {
				socket.to(chatId).emit('error occurred');
			}
		};	

		socket.on('chat created', chatCreate(socket));	
		socket.on('chat deleted', chatDeleted(socket));
		socket.on('user join', enterChat);
		socket.on('send message', sendMessage(socket));
		socket.on('chat renamed', chatRenamed(socket));
		socket.on('delete chat', deleteChat(socket));		
		
	});
};

export default socketConnection;