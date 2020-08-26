import Drawer from "./drawer";
import TacticalUI from "./tactical-ui";
import logger from "./logger";
import { TacticalEvent, EventManager } from "./event-manager";

enum ClickMode { MOVE, ATTACK };

export default class GameManager {
    private unitStates: any;
    private battlefield: any;
    private currentUnitId: any;
    private battleId: any;
    private drawer: Drawer;
    private mode: ClickMode = ClickMode.MOVE;
    private selectedUnitState?: any;
    private eventManager: EventManager;

    constructor(drawer: Drawer, ui: TacticalUI, eventManager: EventManager) {
        this.drawer = drawer;
        this.eventManager = eventManager;

        this.eventManager.listen(TacticalEvent.CLICK_ON_UNIT, this.onClickOnUnit());
        this.eventManager.listen(TacticalEvent.CLICK_ON_POSITION, this.onClickOnPosition());
        this.eventManager.listen(TacticalEvent.CLICK_ON_MENU_MOVE, this.onMove());
        this.eventManager.listen(TacticalEvent.CLICK_ON_MENU_ATTACK, this.onAttack());
        this.eventManager.listen(TacticalEvent.CLICK_ON_MENU_NEXT_TURN, this.onNextTurn());
        this.eventManager.listen(TacticalEvent.CLICK_ON_MENU_RESET_TURN, this.onResetAction());

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.battleId = urlParams.get('id');

        this.eventManager.dispatch(TacticalEvent.ASK_BATTLE, this.battleId);

        this.eventManager.listen(TacticalEvent.BATTLE, (battle: any) => {
            this.unitStates = battle.unitStates;
            this.currentUnitId = battle.currentUnitId;
            if (battle.fieldId && !this.battlefield) {
                this.eventManager.dispatch(TacticalEvent.ASK_FIELD, battle.fieldId);
            }
        });

        this.eventManager.listen(TacticalEvent.FIELD, (data: any) => {
            this.battlefield = data;
            this.drawer.load(data.tileTypes, () => {
                this.drawer.drawBattlefield(this.battlefield);
                this.drawer.drawUnits(this.unitStates);
            });
        });

        this.eventManager.listen(TacticalEvent.ERROR, (error: any) => {
            // logger.logError(error);
        });

        this.eventManager.listen(TacticalEvent.POSITIONS, (data: any) => {
            this.drawer.drawPositionsForMove(data.positions);
        });

        this.eventManager.listen(TacticalEvent.ACTION_INFO, (data: any) => {
            this.drawer.drawPositionsForAction(data.positions);
        });

        this.eventManager.listen(TacticalEvent.MOVE, (unitState: any) => {
            this.drawer.updateUnit(unitState);
        });

        this.eventManager.listen(TacticalEvent.END_TURN, (battle: any) => {
            this.currentUnitId = battle.currentUnitId;
            this.drawer.clearPositionTiles();
            this.drawer.updateUnits(battle.unitStates);
        });

        this.eventManager.listen(TacticalEvent.ROLLBACK_ACTION, (battle: any) => {
            this.drawer.clearPositionTiles();
            this.drawer.updateUnits(battle.unitStates);
        });
    }

    onClickOnUnit() {
        return (unitState: any) => {
            console.log(this.selectedUnitState);
            if (!this.selectedUnitState) {
                this.selectedUnitState = unitState;
                const data: any = {
                    battleId: this.battleId,
                    unitId: unitState.unit.id
                };
                if (this.mode === ClickMode.MOVE) {
                    this.eventManager.dispatch(TacticalEvent.ASK_POSITIONS, data);
                } else {
                    data.actionTypeId = "attack";
                    this.eventManager.dispatch(TacticalEvent.ASK_ACTION_INFO, data);
                }
            } else if (this.selectedUnitState.unit.id !== unitState.unit.id) {
                this.onClickOnPosition()(unitState.position);
            }
        }
    }

    onClickOnPosition() {
        return (position: any) => {
            console.log(this.selectedUnitState);
            const data: any = {
                battleId: this.battleId,
                unitId: this.currentUnitId,
                position: position
            };
            if (this.mode === ClickMode.MOVE && !this.selectedUnitState.moved) {
                this.eventManager.dispatch(TacticalEvent.ASK_MOVE, data);
            } else if (this.mode === ClickMode.ATTACK && !this.selectedUnitState.acted) {
                data.actionTypeId = "attack";
                this.eventManager.dispatch(TacticalEvent.ASK_ACT, data);
            }
            this.drawer.clearPositionTiles();
            this.selectedUnitState = undefined;
        }
    }

    onMove() {
        return () => {
            this.drawer.clearPositionTiles();
            this.mode = ClickMode.MOVE;
            this.selectedUnitState = undefined;
        }
    }

    onAttack() {
        return () => {
            this.drawer.clearPositionTiles();
            this.mode = ClickMode.ATTACK;
            this.selectedUnitState = undefined;
        }
    }

    onNextTurn() {
        return () => {
            this.eventManager.dispatch(TacticalEvent.ASK_END_TURN, this.battleId);
            this.selectedUnitState = undefined;
        }
    }

    onResetAction() {
        return () => {
            this.eventManager.dispatch(TacticalEvent.ASK_ROLLBACK_ACTION, this.battleId);
            this.selectedUnitState = undefined;
        }
    }
}

