import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io'; 
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routerAuth from './routers/user.js';
import routerChat from './routers/chat.js';
import session from 'express-session';
import { sessionOptions } from './app.config.js';
import socketConnection from './socket/socketConnection.js';

const PORT = process.env.PORT || 1069;
const databaseURL = `mongodb+srv://phonty29:password@cluster0.8obqr.mongodb.net/chat-rooms?retryWrites=true&w=majority`;

const app = express();
const server = http.createServer(app);
const io = new Server(server); 

app.use(express.json());
app.use(express.static('files/storage'));
app.use(express.static('assets'));
app.use(fileUpload({}));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session(sessionOptions));
app.get('/', (req, res) => {res.status(200).sendFile(path.resolve() + '/assets/main.html')});
app.use('/auth', routerAuth);
app.use('/chats', routerChat);
app.set('view engine', 'ejs');


async function main() {
	try {
		await mongoose.connect(databaseURL, {useUnifiedTopology: true, useNewUrlParser: true});
		socketConnection(io);
		server.listen(PORT, () => console.log(`THE SERVER /chatoff-mine/ STARTED ON THE PORT = ${PORT}`));
	} catch (e) {
		console.log(e);
	}
}
main();

export default server;
