import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const Message = new Schema({
	author: {type: Schema.Types.ObjectId, required: true},
	content: {type: String, required: true}
});

const Chat = new Schema({
	creator: {type: Schema.Types.ObjectId, required: true},
	name: {type: String, required: true},
	messages: {type: [Message]},
	members: [{socketId: String, name: String}]
});

export default model('Chat ', Chat);
