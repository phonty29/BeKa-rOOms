import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const User = new Schema({
	name: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	avatar: String
});


export default model('User', User);