import path from 'path';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import FileService from '../files/service.js';

class UserController {
	getSignUpPage(req, res) {
		try {
			res.render('sign-up');	
		} catch(e) {
			res.status(500).json(e);
		}			
	}

	async signUpUser(req, res) { 
		try {
			const errors = validationResult(req).errors;
			if(errors.length) {
				return res.status(400).json({message: errors[0].msg});
			}
			const {name, password} = req.body;
			const isNotAvailable = await User.findOne({name});
			if (isNotAvailable) 
				return res.status(400).json({message: 'This username is not available. Please chose the another one'});
			const avatar = FileService.download(req.files.avatar);
			const passwordHashed = bcrypt.hashSync(password, 5);
			const user = new User({name, password: passwordHashed, avatar});
			await user.save();
			return res.status(200).json({message: 'The user has signed-up successfuly'});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Error while sign-up'});		
		}
	}						

	getSignInPage(req, res) {
		try {
			res.render('sign-in');	
		} catch(e) {
			res.status(500).json(e);
		}			
	}

	async signInUser(req, res) { 
		try {
			const {name, password} = req.body;
			const user = await User.findOne({name});
			if (!user) {
				return res.status(400).json({message: 'The user was not found'});
			}
			const isValidPassword = bcrypt.compareSync(password, user.password);
			if (isValidPassword == false) {
				return res.status(400).json({message: 'The password is wrong'});
			}
			if (req.session.user_id) {
				res.status(200).clearCookie('connect.sid');
				req.session.destroy((err) => {if (err) return res.status(500).json({message: 'Something get wrong while authorization'})});				
			}
			req.session.user_id = user._id;
			return res.status(200).json({message: 'Success'});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Error while signing-in'});			
		}
	}	

	unsignedUser(req, res) {
		try {
			res.status(200).clearCookie('connect.sid');
			req.session.destroy((err) => {
				return res.status(200).json({message: 'The user succesfully unsigned'});
			});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Error'});						
		}
	}

	async deleteUser(req, res) {
		try {
			const message = await User.findByIdAndDelete(req.session.user_id);
			res.status(200).clearCookie('connect.sid');
			req.session.destroy((err) => {
				return res.status(200).json({message: message});
			});
		} catch(e) {
			console.log(e);
            res.status(500).json({message: 'Error'});						
		}
	}	
}

export default new UserController();


