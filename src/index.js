import logMessage from './ts/logger';
import * as PIXI from 'pixi.js';
import TacticalUI from './ts/tactical-ui';
import Drawer from './ts/drawer';
import SocketManager from './ts/socket-manager';
import { EventManager } from "./ts/event-manager";
import './css/style.css';

window.onload = function () {
    const app = new PIXI.Application({ width: 1000, height: 600 });

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    const eventManager = new EventManager();
    const drawer = new Drawer(app, eventManager);
    const ui = new TacticalUI(app, eventManager);
    const socketManager = new SocketManager(drawer, ui, eventManager);
    
    logMessage('A very warm welcome to Expack!');

    // Needed for Hot Module Replacement
    if (typeof (module.hot) !== 'undefined') {
        module.hot.accept();
        logMessage("Hot deploy successful");
    }

    // prevent right click contextBox
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
    });
}