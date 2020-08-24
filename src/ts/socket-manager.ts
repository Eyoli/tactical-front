import Drawer from "./drawer";
import TacticalUI from "./tactical-ui";
import io from 'socket.io-client';
import logMessage from "./logger";

export default class SocketManager {
    private unitStates: any;
    private battlefield: any;
    private currentUnitId: any;
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

        socket.on("battle", (battle: any) => {
            logMessage(battle);
            this.unitStates = battle.unitStates;
            this.currentUnitId = battle.currentUnitId;
            if (battle.fieldId && !this.battlefield) {
                socket.emit("battlefield", battle.fieldId);
            }
        });

        socket.on("battlefield", (data: any) => {
            logMessage(data);
            this.battlefield = data;
            this.drawer.load(data.tileTypes, () => {
                this.drawer.drawBattlefield(this.battlefield);
                this.drawer.drawUnits(this.unitStates, SocketManager.onClickOnUnit);

                ui.withMenu(800)
                    .withButton("Move", 30, SocketManager.onMove)
                    .withButton("Attack", 80, SocketManager.onAttack)
                    .withButton("End turn", 130, SocketManager.onNextTurn)
                    .withButton("Reset turn", 180, SocketManager.onResetAction);
            });
        });

        socket.on("battle-error", (error: any) => {
            console.error(error);
        });

        socket.on("positions", (data: any) => {
            logMessage(data);
            if (data.canMove) {
                this.drawer.drawPositionsForMove(data.positions, SocketManager.onClickOnPosition);
            } else {
                this.drawer.drawPositionsForMove(data.positions);
            }
        });

        socket.on("move", (unitState: any) => {
            logMessage(unitState);
            this.drawer.clearPositionTiles();
            this.drawer.updateUnit(unitState, SocketManager.onClickOnUnit);
        });

        socket.on("endTurn", (battle: any) => {
            this.currentUnitId = battle.currentUnitId;
            this.drawer.clearPositionTiles();
            battle.unitStates.forEach(
                (unitState: any) => this.drawer.updateUnit(unitState, SocketManager.onClickOnUnit));
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
        SocketManager.instance.socket.emit("positions", {
            battleId: SocketManager.instance.battleId,
            unitId: unitState.unit.id,
            canMove: unitState.unit.id === SocketManager.instance.currentUnitId
                && !unitState.moved
        });
    }

    static onClickOnPosition(position: any) {
        SocketManager.instance.socket.emit("move", {
            battleId: SocketManager.instance.battleId,
            unitId: SocketManager.instance.currentUnitId,
            position: position
        });
    }

    static onMove() {
        SocketManager.instance.socket.emit("positions", SocketManager.instance.battleId);
    }

    static onAttack() {
        SocketManager.instance.socket.emit("attack", SocketManager.instance.battleId);
    }

    static onNextTurn() {
        SocketManager.instance.socket.emit("endTurn", SocketManager.instance.battleId);
    }

    static onResetAction() {
        SocketManager.instance.socket.emit("rollbackAction", SocketManager.instance.battleId);
    }
}

