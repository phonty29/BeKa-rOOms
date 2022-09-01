import { Router } from 'express';
import { check } from 'express-validator';
import path from 'path';
import UserController from '../controllers/user.js';

const routerAuth = new Router();

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
const checkFormMiddleware = [
	check('name', 'Username must be filled').notEmpty(),
    check('password', 'Password must be at least 5 symbols and contain a number')
    	.not()
    	.isIn(['123', 'password', 'god', 'qwerty'])
    	.withMessage('Do not use a common word as the password')
    	.isLength({ min: 5 })
    	.matches(/\d/)
];

routerAuth.get('/sign-up', UserController.getSignUpPage);
routerAuth.post('/sign-up', checkFormMiddleware, UserController.signUpUser);

routerAuth.get('/sign-in', UserController.getSignInPage);
routerAuth.post('/sign-in', UserController.signInUser);

routerAuth.delete('/sign-in', checkUserMiddleware, UserController.unsignedUser); 
routerAuth.delete('/user', checkUserMiddleware, UserController.deleteUser); 

export default routerAuth;
