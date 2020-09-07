import logger from './ts/game/service/logger';
import * as PIXI from 'pixi.js';
import UIDrawer from './ts/pixi/adapter/ui-drawer';
import BattlefieldDrawer from './ts/pixi/adapter/battlefield-drawer';
import GameManager from './ts/game/game-manager';
import SocketManager from './ts/socket/socket-manager';
import EventManager from "./ts/game/service/event-manager";
import './css/style.css';
import { Events } from './ts/game/enums';
import { handleMouseWheel, handleMouseDrag } from './ts/pixi/canvas-events';
import TacticalStage from './ts/pixi/tactical-stage';
import WaterEffectService from './ts/pixi/service/water-effect-service';

window.onload = function () {
    const app = new PIXI.Application({ width: 1000, height: 600 });
    
    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    handleMouseWheel(app);
    handleMouseDrag(app);

    const tacticalStage = new TacticalStage(app.renderer.view.width, app.renderer.view.height);
    app.stage = tacticalStage;
    const eventManager = new EventManager();
    const waterEffectService = new WaterEffectService(app);
    const drawer = new BattlefieldDrawer(tacticalStage, eventManager, waterEffectService);
    const ui = new UIDrawer(tacticalStage, eventManager);
    const socketManager = new SocketManager(eventManager);
    const gameManager = new GameManager(drawer, ui, eventManager);

    // Needed for Hot Module Replacement
    if (typeof (module.hot) !== 'undefined') {
        module.hot.accept();
        logger.logMessage("Hot deploy successful");
    }

    // prevent right click contextBox
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const battleId = urlParams.get('battleId');
    const fieldId = urlParams.get('fieldId');

    if (battleId) {
        eventManager.dispatch(Events.ASK_BATTLE, battleId);
    } else if (fieldId) {
        eventManager.dispatch(Events.ASK_FIELD, fieldId);
    } else {
        logger.logError("either battleId or fieldId must be present in URL parameters");
    }
}