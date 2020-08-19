import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import config from 'config';
import axios from 'axios';

process.title = config.get("process.title");

const app = express();
const server = new http.Server(app);

const EXPRESS_PORT_NUMBER = config.get("app.port");
const API_HOST: string = config.get("api.host");

app.set('views', __dirname + '/../views');
// static resources
app.use('/static', express.static(__dirname + '/../client'));
// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// redirect some URLs to tactic API
app.get('/api/**', function (req, res) {
	const url: string = API_HOST + req.path.split("/api")[1];
	axios.get(url)
		.then((resp) => res.json(resp.data))
		.catch((error) => {
			res.render("error.ejs", { error: error.response || error });
		});
});

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port ' + EXPRESS_PORT_NUMBER);
});
