import logMessage from './ts/logger';
import * as PIXI from 'pixi.js';
import TacticalUI from './ts/tactical-ui';
import Drawer from './ts/drawer';
import SocketManager from './ts/socket-manager';
import './css/style.css';

window.onload = function () {
    const app = new PIXI.Application({ width: 1000, height: 600 });

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    const drawer = new Drawer(app);
    const socketManager = new SocketManager(drawer);
    const ui = new TacticalUI(app)
        .withMenu(800)
        .withButton("Move", 30, socketManager.onMove())
        .withButton("Attack", 80, socketManager.onAttack())
        .withButton("End turn", 130, socketManager.onNextTurn())
        .withButton("Reset turn", 180, socketManager.onResetAction());

    logMessage('A very warm welcome to Expack!');

    // Needed for Hot Module Replacement
    if (typeof (module.hot) !== 'undefined') {
        module.hot.accept();
        logMessage("Hot deploy successful");
    }
}