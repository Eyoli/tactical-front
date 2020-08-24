import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from 'config';
import socketIo from 'socket.io';
import http from 'http';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.js';
import { RequestHandlerPort, Position } from './request-handler-port';
import RequestHandler from './request-handler';

process.title = config.get("process.title");

const EXPRESS_PORT_NUMBER = config.get("app.port");
const API_HOST: string = config.get("api.host");
const webpackConfigAny: any = webpackConfig;
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app = express();
const server = new http.Server(app);
const compiler = webpack(webpackConfigAny);

const requestHandlerPort: RequestHandlerPort = new RequestHandler(API_HOST);

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))
app.get('*', (req, res, next) => {
    compiler.inputFileSystem.readFile(HTML_FILE, (err, result) => {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    })
});

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log(`App listening to ${EXPRESS_PORT_NUMBER}....`)
    console.log('Press Ctrl+C to quit.')
});

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

	type PositionsRequest = { battleId: string, unitId: string, canMove: boolean };
	socket.on('positions', ({ battleId, unitId, canMove }: PositionsRequest) => {
		requestHandlerPort.getPositions(battleId, unitId)
			.then((resp) => socket.emit("positions", {
				canMove: canMove, 
				positions: resp.data
			}))
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