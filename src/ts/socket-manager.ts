import Drawer from "./drawer";
import TacticalUI from "./tactical-ui";
import io from 'socket.io-client';
import logMessage from "./logger";
import { TacticalEvent, EventManager } from "./event-manager";

enum ClickMode {MOVE, ATTACK};

export default class SocketManager {
    private unitStates: any;
    private battlefield: any;
    private currentUnitId: any;
    private battleId: any;
    private socket: SocketIOClient.Socket;
    private drawer: Drawer;
    private mode: ClickMode = ClickMode.MOVE;

    constructor(drawer: Drawer, ui: TacticalUI, eventManager: EventManager) {
        this.drawer = drawer;

        eventManager.addEventListener(TacticalEvent.EVENT_CLICK_ON_UNIT, this.onClickOnUnit());
        eventManager.addEventListener(TacticalEvent.EVENT_CLICK_ON_POSITION, this.onClickOnPosition());
        eventManager.addEventListener(TacticalEvent.EVENT_CLICK_ON_MENU_MOVE, this.onMove());
        eventManager.addEventListener(TacticalEvent.EVENT_CLICK_ON_MENU_ATTACK, this.onAttack());
        eventManager.addEventListener(TacticalEvent.EVENT_CLICK_ON_MENU_NEXT_TURN, this.onNextTurn());
        eventManager.addEventListener(TacticalEvent.EVENT_CLICK_ON_MENU_RESET_TURN, this.onResetAction());

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
                this.drawer.drawUnits(this.unitStates);
            });
        });

        socket.on("battle-error", (error: any) => {
            console.error(error);
        });

        socket.on("positions", (data: any) => {
            logMessage("POSITIONS", data);
            this.drawer.drawPositionsForMove(data.positions);
        });

        socket.on("actionInfo", (data: any) => {
            logMessage("ACTION INFO", data);
            this.drawer.drawPositionsForAction(data.positions);
        });

        socket.on("move", (unitState: any) => {
            this.drawer.updateUnit(unitState);
            logMessage("MOVE", unitState);
        });

        socket.on("endTurn", (battle: any) => {
            this.currentUnitId = battle.currentUnitId;
            this.drawer.clearPositionTiles();
            this.drawer.updateUnits(battle.unitStates);
            logMessage("END TURN", battle);
        });

        socket.on("rollbackAction", (battle: any) => {
            this.drawer.clearPositionTiles();
            this.drawer.updateUnits(battle.unitStates);
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
            let socketEvent: string;
            if (this.mode === ClickMode.MOVE) {
                socketEvent = "move";
            } else {
                socketEvent = "act";
            }
            this.drawer.clearPositionTiles();
            this.socket.emit(socketEvent, {
                battleId: this.battleId,
                unitId: this.currentUnitId,
                position: position
            });
        }
    }

    onMove() {
        return () => {
            this.drawer.clearPositionTiles();
            this.mode = ClickMode.MOVE;
        }
    }

    onAttack() {
        return () => {
            this.drawer.clearPositionTiles();
            this.mode = ClickMode.ATTACK;
        }
    }

    onNextTurn() {
        return () => this.socket.emit("endTurn", this.battleId);
    }

    onResetAction() {
        return () => this.socket.emit("rollbackAction", this.battleId);
    }
}

