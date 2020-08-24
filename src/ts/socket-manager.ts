import Drawer from "./drawer";
import TacticalUI from "./tactical-ui";
import io from 'socket.io-client';
import logMessage from "./logger";

export default class SocketManager {
    private unitStates: any;
    private battlefield: any;
    private selectedUnitId: any;
    private battleId: any;
    private socket: SocketIOClient.Socket;
    private drawer: Drawer;
    private static instance: SocketManager;

    private constructor(drawer: Drawer, ui: TacticalUI) {
        this.drawer = drawer;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.battleId = urlParams.get('id');
        logMessage(this.battleId);
        
        const socket = io('http://localhost:3001');
        socket.emit("battle", this.battleId);

        socket.on("battle", (data: any) => {
            logMessage(data);
            this.unitStates = data.unitStates;
            if (data.fieldId && !this.battlefield) {
                socket.emit("battlefield", data.fieldId);
            }
        });

        socket.on("battlefield", (data: any) => {
            logMessage(data);
            this.battlefield = data;
            this.drawer.load(data.tileTypes, () => {
                this.drawer.drawBattlefield(this.battlefield);
                this.drawer.drawUnits(this.unitStates, SocketManager.onClickOnUnit);
                ui.drawNextTurnButton(SocketManager.onClickOnNextTurnButton);
                ui.drawResetTurnButton(SocketManager.onClickOnResetTurnButton);
            });
        });

        socket.on("battle-error", (error: any) => {
            console.error(error);
        });

        socket.on("positions", (positions: any[]) => {
            logMessage(positions);
            this.drawer.drawPositions(positions, SocketManager.onClickOnPosition);
        });

        socket.on("move", (unitState: any) => {
            logMessage(unitState);
            this.drawer.clearPositionTiles();
            this.drawer.updateUnit(unitState, SocketManager.onClickOnUnit);
        });

        socket.on("endTurn", (battle: any) => {
            this.drawer.clearPositionTiles();
            logMessage("END TURN", battle);
        });

        socket.on("rollbackAction", (battle: any) => {
            this.drawer.clearPositionTiles();
            battle.unitStates.forEach(
                (unitState: any) => this.drawer.updateUnit(unitState, SocketManager.onClickOnUnit));
            logMessage("ROLLBACK ACTION", battle);
        });

        this.socket = socket;
}

    static init(drawer: Drawer, ui: TacticalUI): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager(drawer, ui);
        }
        return SocketManager.instance;
    }

    static onClickOnUnit(unitState: any) {
        logMessage(unitState);
        SocketManager.instance.selectedUnitId = unitState.unit.id;
        SocketManager.instance.socket.emit("positions", {
            battleId: SocketManager.instance.battleId,
            unitId: SocketManager.instance.selectedUnitId
        });
    }

    static onClickOnPosition(position: any) {
        SocketManager.instance.socket.emit("move", {
            battleId: SocketManager.instance.battleId,
            unitId: SocketManager.instance.selectedUnitId,
            position: position
        });
    }

    static onClickOnNextTurnButton() {
        SocketManager.instance.socket.emit("endTurn", SocketManager.instance.battleId);
    }

    static onClickOnResetTurnButton() {
        SocketManager.instance.socket.emit("rollbackAction", SocketManager.instance.battleId);
    }
}

