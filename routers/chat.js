import { Router } from 'express';
import ChatController from '../controllers/chat.js';
import MessageController from '../controllers/message.js';

const routerChat = new Router();

const checkUserMiddleware = (req, res, next) => {
		try {
			const session = req.session;
			const sessionID = req.sessionID;
			if (!session || !sessionID || !session.user_id) {
				return res.status(400).json({message: 'The non-authorized user'});
			}
			next();
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Cannot access this page'});						
		}			
};
const checkParamsMiddleware = (req, res, next) => {
		try {
			const chatId = req.params.id;
			if (!chatId) {
				return res.status(400).json({message: 'Chat is not selected'});
			}			
			next();
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Cannot access this page'});						
		}			
};

routerChat.get('/', checkUserMiddleware, ChatController.getChats);
routerChat.get('/:id', [checkUserMiddleware, checkParamsMiddleware], ChatController.openChat);
routerChat.post('/', checkUserMiddleware, ChatController.createChat);
routerChat.put('/', checkUserMiddleware, ChatController.renameChat);
routerChat.delete('/:id', [checkUserMiddleware, checkParamsMiddleware], ChatController.deleteChat);

//sending a message
routerChat.put('/:id', [checkUserMiddleware, checkParamsMiddleware], MessageController.sendMessage);

export default routerChat;