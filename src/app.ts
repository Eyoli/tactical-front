import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import config from 'config';
import axios from 'axios';
import socketIo from 'socket.io';

process.title = config.get("process.title");

const app = express();
const server = new http.Server(app);

const EXPRESS_PORT_NUMBER = config.get("app.port");
const API_HOST: string = config.get("api.host");

app.set('views', __dirname + '/../views');
// static resources
app.use('/public', express.static(__dirname + '/../client'));
// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.render("index.ejs");
});

app.get('/games', function (req, res) {
	// Load list of games
	const url: string = API_HOST + "/api/games/";
	axios.get(url)
		.then((resp) => res.render("games.ejs", {games: resp.data}))
		.catch((error) => res.render("error.ejs", {error: error}));
});

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port ' + EXPRESS_PORT_NUMBER);
});

// Chargement de socket.io
const io = socketIo.listen(server);

io.on('connect', (socket) => {
	console.log(socket.id + " : User connected");

	socket.on('disconnect', (reason: string) => {
		console.log(socket.id + " : User disconnected");
	});
});