/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/request-handler.ts":
/*!***************************************!*\
  !*** ./src/server/request-handler.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar axios_1 = __importDefault(__webpack_require__(/*! axios */ \"axios\"));\r\nvar RequestHandler = /** @class */ (function () {\r\n    function RequestHandler(apiHost) {\r\n        this.apiHost = apiHost;\r\n    }\r\n    RequestHandler.prototype.rollbackAction = function (battleId) {\r\n        var url = this.apiHost + \"/games/\" + battleId + \"/rollbackAction\";\r\n        return axios_1.default.post(url);\r\n    };\r\n    RequestHandler.prototype.endTurn = function (battleId) {\r\n        var url = this.apiHost + \"/games/\" + battleId + \"/endTurn\";\r\n        return axios_1.default.post(url);\r\n    };\r\n    RequestHandler.prototype.getBattles = function () {\r\n        var url = this.apiHost + \"/games/\";\r\n        return axios_1.default.get(url);\r\n    };\r\n    RequestHandler.prototype.move = function (battleId, unitId, position) {\r\n        var url = this.apiHost + \"/games/\" + battleId + \"/units/\" + unitId + \"/move\";\r\n        return axios_1.default.post(url, { position: position });\r\n    };\r\n    RequestHandler.prototype.getPositions = function (battleId, unitId) {\r\n        var url = this.apiHost + \"/games/\" + battleId + \"/units/\" + unitId + \"/positions\";\r\n        return axios_1.default.get(url);\r\n    };\r\n    RequestHandler.prototype.getBattlefield = function (battlefieldId) {\r\n        var url = this.apiHost + \"/fields/\" + battlefieldId;\r\n        return axios_1.default.get(url);\r\n    };\r\n    RequestHandler.prototype.getBattle = function (battleId) {\r\n        var url = this.apiHost + \"/games/\" + battleId;\r\n        return axios_1.default.get(url);\r\n    };\r\n    return RequestHandler;\r\n}());\r\nexports.default = RequestHandler;\r\n\n\n//# sourceURL=webpack:///./src/server/request-handler.ts?");

/***/ }),

/***/ "./src/server/server.ts":
/*!******************************!*\
  !*** ./src/server/server.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\r\nvar express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\nvar webpack_1 = __importDefault(__webpack_require__(/*! webpack */ \"webpack\"));\r\nvar config_1 = __importDefault(__webpack_require__(/*! config */ \"config\"));\r\nvar socket_io_1 = __importDefault(__webpack_require__(/*! socket.io */ \"socket.io\"));\r\nvar http_1 = __importDefault(__webpack_require__(/*! http */ \"http\"));\r\nvar webpack_dev_middleware_1 = __importDefault(__webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\"));\r\nvar webpack_hot_middleware_1 = __importDefault(__webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\"));\r\nvar webpack_config_js_1 = __importDefault(__webpack_require__(/*! ../../webpack.config.js */ \"./webpack.config.js\"));\r\nvar request_handler_1 = __importDefault(__webpack_require__(/*! ./request-handler */ \"./src/server/request-handler.ts\"));\r\nprocess.title = config_1.default.get(\"process.title\");\r\nvar EXPRESS_PORT_NUMBER = config_1.default.get(\"app.port\");\r\nvar API_HOST = config_1.default.get(\"api.host\");\r\nvar webpackConfigAny = webpack_config_js_1.default;\r\nvar DIST_DIR = __dirname;\r\nvar HTML_FILE = path_1.default.join(DIST_DIR, 'index.html');\r\nvar app = express_1.default();\r\nvar server = new http_1.default.Server(app);\r\nvar compiler = webpack_1.default(webpackConfigAny);\r\nvar requestHandlerPort = new request_handler_1.default(API_HOST);\r\napp.use(webpack_dev_middleware_1.default(compiler, {\r\n    publicPath: webpack_config_js_1.default.output.publicPath\r\n}));\r\napp.use(webpack_hot_middleware_1.default(compiler));\r\napp.get('*', function (req, res, next) {\r\n    compiler.inputFileSystem.readFile(HTML_FILE, function (err, result) {\r\n        if (err) {\r\n            return next(err);\r\n        }\r\n        res.set('content-type', 'text/html');\r\n        res.send(result);\r\n        res.end();\r\n    });\r\n});\r\nserver.listen(EXPRESS_PORT_NUMBER, function () {\r\n    console.log(\"App listening to \" + EXPRESS_PORT_NUMBER + \"....\");\r\n    console.log('Press Ctrl+C to quit.');\r\n});\r\n// Chargement de socket.io\r\nvar io = socket_io_1.default.listen(server);\r\nio.on('connect', function (socket) {\r\n    console.log(socket.id + \" : User connected\");\r\n    socket.on('disconnect', function (reason) {\r\n        console.log(socket.id + \" : User disconnected\");\r\n    });\r\n    socket.on('battle', function (id) {\r\n        requestHandlerPort.getBattle(id)\r\n            .then(function (resp) { return socket.emit(\"battle\", resp.data); })\r\n            .catch(function (error) { return catchError(error); });\r\n    });\r\n    socket.on('battlefield', function (id) {\r\n        requestHandlerPort.getBattlefield(id)\r\n            .then(function (resp) { return socket.emit(\"battlefield\", resp.data); })\r\n            .catch(function (error) { return catchError(error); });\r\n    });\r\n    socket.on('positions', function (_a) {\r\n        var battleId = _a.battleId, unitId = _a.unitId;\r\n        requestHandlerPort.getPositions(battleId, unitId)\r\n            .then(function (resp) { return socket.emit(\"positions\", resp.data); })\r\n            .catch(function (error) { return catchError(error); });\r\n    });\r\n    socket.on('move', function (_a) {\r\n        var battleId = _a.battleId, unitId = _a.unitId, position = _a.position;\r\n        requestHandlerPort.move(battleId, unitId, position)\r\n            .then(function (resp) { return socket.emit(\"move\", resp.data); })\r\n            .catch(function (error) { return catchError(error); });\r\n    });\r\n    socket.on('endTurn', function (id) {\r\n        requestHandlerPort.endTurn(id)\r\n            .then(function (resp) { return socket.emit(\"endTurn\", resp.data); })\r\n            .catch(function (error) { return catchError(error); });\r\n    });\r\n    socket.on('rollbackAction', function (id) {\r\n        requestHandlerPort.rollbackAction(id)\r\n            .then(function (resp) { return socket.emit(\"rollbackAction\", resp.data); })\r\n            .catch(function (error) { return catchError(error); });\r\n    });\r\n    function catchError(error) {\r\n        if (error.response.data.error) {\r\n            socket.emit(\"battle-error\", error.response.data.error);\r\n        }\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack:///./src/server/server.ts?");

/***/ }),

/***/ "./webpack.config.js":
/*!***************************!*\
  !*** ./webpack.config.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const path = __webpack_require__(/*! path */ \"path\");\n\nconst webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nconst HtmlWebPackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nconst CopyPlugin = __webpack_require__(/*! copy-webpack-plugin */ \"copy-webpack-plugin\");\n\nmodule.exports = {\n  entry: {\n    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']\n  },\n  output: {\n    path: path.join(__dirname, 'dist'),\n    publicPath: '/',\n    filename: '[name].js'\n  },\n  mode: 'development',\n  target: 'web',\n  resolve: {\n    extensions: ['.ts', '.tsx', '.js']\n  },\n  devtool: 'source-map',\n  module: {\n    rules: [{\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"babel-loader\"\n    }, {\n      test: /\\.tsx?$/,\n      loader: 'awesome-typescript-loader',\n      exclude: /node_modules/,\n      query: {\n        declaration: false\n      }\n    }, {\n      // Loads the javacript into html template provided.\n      // Entry point is set below in HtmlWebPackPlugin in Plugins \n      test: /\\.html$/,\n      use: [{\n        loader: \"html-loader\" //options: { minimize: true }\n\n      }]\n    }, {\n      test: /\\.css$/,\n      use: ['style-loader', 'css-loader']\n    }, {\n      test: /\\.(png|svg|jpg|gif)$/,\n      use: ['file-loader']\n    }]\n  },\n  plugins: [new HtmlWebPackPlugin({\n    template: \"./src/html/index.html\",\n    filename: \"./index.html\",\n    excludeChunks: ['server']\n  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin(), new CopyPlugin({\n    patterns: [{\n      from: './src/img',\n      to: 'assets'\n    }]\n  })]\n};\n\n//# sourceURL=webpack:///./webpack.config.js?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "config":
/*!*************************!*\
  !*** external "config" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"config\");\n\n//# sourceURL=webpack:///external_%22config%22?");

/***/ }),

/***/ "copy-webpack-plugin":
/*!**************************************!*\
  !*** external "copy-webpack-plugin" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"copy-webpack-plugin\");\n\n//# sourceURL=webpack:///external_%22copy-webpack-plugin%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"html-webpack-plugin\");\n\n//# sourceURL=webpack:///external_%22html-webpack-plugin%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-hot-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-hot-middleware%22?");

/***/ })

/******/ });