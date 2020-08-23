import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import config from 'config';
import socketIo from 'socket.io';
import RequestHandler from './request-handler';
import { RequestHandlerPort, Position } from './request-handler-port';

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

app.get('/battles', function (req, res) {
	requestHandlerPort.getBattles()
		.then((resp) => res.render("battles.ejs", { battles: resp.data }))
		.catch((error) => res.render("error.ejs", { error: error }));
});

app.get('/battle', function (req, res) {
	res.render("battle.ejs");
});

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port ' + EXPRESS_PORT_NUMBER);
});

const requestHandlerPort: RequestHandlerPort = new RequestHandler(API_HOST);

// Chargement de socket.io
const io = socketIo.listen(server);

io.on('connect', (socket) => {
	console.log(socket.id + " : User connected");

	socket.on('disconnect', (reason: string) => {
		console.log(socket.id + " : User disconnected");
	});

	socket.on('battle', (id: string) => {
		requestHandlerPort.getBattle(id)
			.then((resp) => socket.emit("battle", resp.data))
			.catch((error) => catchError(error));
	});

	socket.on('battlefield', (id: string) => {
		requestHandlerPort.getBattlefield(id)
			.then((resp) => socket.emit("battlefield", resp.data))
			.catch((error) => catchError(error));
	});

	type PositionsRequest = { battleId: string, unitId: string };
	socket.on('positions', ({ battleId, unitId }: PositionsRequest) => {
		requestHandlerPort.getPositions(battleId, unitId)
			.then((resp) => socket.emit("positions", resp.data))
			.catch((error) => catchError(error));
	});

	type MoveRequest = { battleId: string, unitId: string, position: Position };
	socket.on('move', ({ battleId, unitId, position }: MoveRequest) => {
		requestHandlerPort.move(battleId, unitId, position)
			.then((resp) => socket.emit("move", resp.data))
			.catch((error) => catchError(error));
	});

	socket.on('endTurn', (id: string) => {
		requestHandlerPort.endTurn(id)
			.then((resp) => socket.emit("endTurn", resp.data))
			.catch((error) => catchError(error));
	});

	socket.on('rollbackAction', (id: string) => {
		requestHandlerPort.rollbackAction(id)
			.then((resp) => socket.emit("rollbackAction", resp.data))
			.catch((error) => catchError(error));
	});

	function catchError(error: any) {
		if (error.response.data.error) {
			socket.emit("battle-error", error.response.data.error);
		}
	}
});