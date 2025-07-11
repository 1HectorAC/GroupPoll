const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin:'*', methods:['GET','POST']}});

app.get('/', (req,res) => {
	res.send('<h1>Test of Node App.</h1>')
});

io.on('connection', socket => {
	console.log(socket.id + " connected");


	io.on('disconnect', () => {
		console.log(socket.id + " disconnected");
	})
})

server.listen(5000, () => {console.log("Listening on 5000...")});
