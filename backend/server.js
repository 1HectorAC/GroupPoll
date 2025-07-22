const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin:'*', methods:['GET','POST']}});

app.get('/', (req,res) => {
	res.send('<h1>Test of Node App.</h1>')
});

function getFirstRoom(s) {
	const rooms = s.rooms;
	const room = ([...rooms].filter(i => i != s.id))[0];
	return room;
};

io.on('connection', socket => {
	console.log(socket.id + " connected");
	
	socket.on('join_room', (data) => {
		console.log("Atempt Join Room, user:" + socket.id + ", room: " + data.room + " userType:" + data.user);
		const roomExists = io.sockets.adapter.rooms.has(data.room);
		if(data.user === 'creator' && !roomExists){
			socket.join(data.room);
			socket.emit('join_room_confirmation', {check:true, userType:data.user})
		}
		else if(data.user === 'other' && roomExists){
			socket.join(data.room);
			socket.to(data.room).emit('user_enter');
			socket.emit('join_room_confirmation', {check:true, userType:data.user})
		}
		else{
			socket.emit('join_room_confirmation', {check:false, userType:data.user})
			console.log('Join room fail');

		}
	})
	socket.on('poll', data => {
		console.log('Poll sent, data:' + data);
		const room = getFirstRoom(socket);
		socket.to(room).emit('get_poll', data);
	})

	socket.on('user_response', data => {
		console.log('Send response by user, user:' + socket.id + ', data:' + data);
		const room = getFirstRoom(socket);
		socket.to(room).emit('get_user_response', data);
	})

	socket.on('results', (data) => {
		console.log('Results sent, data:' + data)
		const room = getFirstRoom(socket);
		socket.to(room).emit('get_results', data);
	})

	socket.on('leave_rooms', () => {
		console.log("Leaving rooms, user:" + socket.id)
		socket.rooms.forEach((room) => {
			if(room != socket.id){
				socket.leave(room);
			}
		})
	})
	socket.on('leave_rooms_early', () =>{
		console.log('Leaving rooms early, users:' + socket.id);

		const roomx = getFirstRoom(socket);
		socket.to(roomx).emit('left_rooms_early');

		socket.rooms.forEach((room) => {
			if(room != socket.id){
				socket.leave(room);
			}
		})
	})

	socket.on('room_check', () => {
		console.log('room check for: ' + socket.id);
		const room = getFirstRoom(socket) || '';
		console.log('room: ' + room);
		socket.emit('room_check_back', room)
	})

	socket.on('disconnect', () => {
		console.log("disconnected, user:" + socket.id);
	})
})

server.listen(5000, () => {console.log("Listening on 5000...")});
