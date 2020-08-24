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

    const ui = new TacticalUI(app);
    const drawer = new Drawer(app);
    SocketManager.init(drawer, ui);

    logMessage('A very warm welcome to Expack!');

    // Needed for Hot Module Replacement
    if (typeof (module.hot) !== 'undefined') {
        module.hot.accept();
        logMessage("Hot deploy successful");
    }
}