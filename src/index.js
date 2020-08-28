import logger from './ts/game/service/logger';
import * as PIXI from 'pixi.js';
import TacticalUI from './ts/pixi/adapter/tactical-ui';
import Drawer from './ts/pixi/adapter/drawer';
import GameManager from './ts/game/game-manager';
import SocketManager from './ts/socket/socket-manager';
import EventManager from "./ts/game/service/event-manager";
import './css/style.css';

window.onload = function () {
    const app = new PIXI.Application({ width: 1000, height: 600 });

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    const eventManager = new EventManager();
    const drawer = new Drawer(app, eventManager);
    const ui = new TacticalUI(app, eventManager);
    const socketManager = new SocketManager(eventManager);
    const gameManager = new GameManager(drawer, ui, eventManager);
    
    logger.logMessage('A very warm welcome to Expack!');

    // Needed for Hot Module Replacement
    if (typeof (module.hot) !== 'undefined') {
        module.hot.accept();
        logger.logMessage("Hot deploy successful");
    }

    // prevent right click contextBox
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
    });
}