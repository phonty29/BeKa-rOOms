import MongoStore from 'connect-mongo';

const databaseURL = `mongodb+srv://phonty29:meth132435@cluster0.8obqr.mongodb.net/chat-rooms?retryWrites=true&w=majority`;
const hours = 60*60;
const minutes = 60; 
const expireTime = 24*hours; //seconds

export const sessionOptions = {
	secret: 'MarkZuckerbergIsAsshole',
	resave: false,
	saveUninitialized: false, 
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: expireTime*1000 //milliseconds
	},
	store: MongoStore.create({ mongoUrl: databaseURL, ttl: expireTime})
};