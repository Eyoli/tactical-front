import Drawer from "./drawer";
import TacticalUI from "./tactical-ui";
import io from 'socket.io-client';
import logMessage from "./logger";

enum ClickMode {MOVE, ATTACK};

export default class SocketManager {
    private unitStates: any;
    private battlefield: any;
    private currentUnitId: any;
    private battleId: any;
    private socket: SocketIOClient.Socket;
    private drawer: Drawer;
    private mode: ClickMode = ClickMode.MOVE;

    constructor(drawer: Drawer, ui: TacticalUI) {
        this.drawer = drawer;

        const socket = io('http://localhost:3001');

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.battleId = urlParams.get('id');

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
                this.drawer.drawUnits(this.unitStates, this.onClickOnUnit());
            });
        });

        socket.on("battle-error", (error: any) => {
            console.error(error);
        });

        socket.on("positions", (data: any) => {
            logMessage("POSITIONS", data);
            if (data.canMove) {
                this.drawer.drawPositionsForMove(data.positions, this.onClickOnPosition());
            } else {
                this.drawer.drawPositionsForMove(data.positions);
            }
        });

        socket.on("move", (unitState: any) => {
            this.drawer.clearPositionTiles();
            this.drawer.updateUnit(unitState, this.onClickOnUnit());
            logMessage("MOVE", unitState);
        });

        socket.on("endTurn", (battle: any) => {
            this.currentUnitId = battle.currentUnitId;
            this.drawer.clearPositionTiles();
            battle.unitStates.forEach(
                (unitState: any) => this.drawer.updateUnit(unitState, this.onClickOnUnit()));
            logMessage("END TURN", battle);
        });

        socket.on("rollbackAction", (battle: any) => {
            this.drawer.clearPositionTiles();
            battle.unitStates.forEach(
                (unitState: any) => this.drawer.updateUnit(unitState, this.onClickOnUnit()));
            logMessage("ROLLBACK ACTION", battle);
        });

        this.socket = socket;
    }

    onClickOnUnit() {
        return (unitState: any) => {
            logMessage("CLICK UNIT", unitState);
            const data: any = {
                battleId: this.battleId,
                unitId: unitState.unit.id
            };
            if (this.mode === ClickMode.MOVE) {
                data.canMove = unitState.unit.id === this.currentUnitId && !unitState.moved;
                this.socket.emit("positions", data);
            } else {
                data.canAct = unitState.unit.id === this.currentUnitId && !unitState.acted;
                data.actionTypeId = "attack";
                this.socket.emit("actionInfo", data);
            }
            
        }
    }

    onClickOnPosition() {
        return (position: any) => {
            this.socket.emit("move", {
                battleId: this.battleId,
                unitId: this.currentUnitId,
                position: position
            });
        }
    }

    onMove() {
        return () => this.mode = ClickMode.MOVE;
    }

    onAttack() {
        return () => this.mode = ClickMode.ATTACK;
    }

    onNextTurn() {
        return () => this.socket.emit("endTurn", this.battleId);
    }

    onResetAction() {
        return () => this.socket.emit("rollbackAction", this.battleId);
    }
}

