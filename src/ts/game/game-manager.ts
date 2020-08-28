import EventManager from "./service/event-manager";
import DrawerPort from "./port/drawer-port";
import UIPort from "./port/ui-port";
import { Mode, Events } from "./enums";

export default class GameManager {
    private eventManager: EventManager;
    private drawerPort: DrawerPort;
    private uiPort: UIPort;

    private unitStates: any;
    private battlefield: any;
    private currentUnitState: any;
    private battleId: any;
    private mode: Mode = Mode.MOVE;
    private selectedUnitState?: any;

    constructor(drawer: DrawerPort, uiPort: UIPort, eventManager: EventManager) {
        this.drawerPort = drawer;
        this.uiPort = uiPort;
        this.eventManager = eventManager;

        this.eventManager.listen(Events.CLICK_ON_UNIT, this.onClickOnUnit());
        this.eventManager.listen(Events.CLICK_ON_POSITION, this.onClickOnPosition());
        this.eventManager.listen(Events.CLICK_ON_MENU_MOVE, this.onMove());
        this.eventManager.listen(Events.CLICK_ON_MENU_ATTACK, this.onAttack());
        this.eventManager.listen(Events.CLICK_ON_MENU_NEXT_TURN, this.onNextTurn());
        this.eventManager.listen(Events.CLICK_ON_MENU_RESET_TURN, this.onResetAction());

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.battleId = urlParams.get('id');

        this.eventManager.dispatch(Events.ASK_BATTLE, this.battleId);

        this.eventManager.listen(Events.BATTLE, (battle: any) => {
            this.unitStates = battle.unitStates;
            this.currentUnitState = battle.currentUnitState;
            this.updateUI();
            if (battle.fieldId && !this.battlefield) {
                this.eventManager.dispatch(Events.ASK_FIELD, battle.fieldId);
            }
        });

        this.eventManager.listen(Events.FIELD, (data: any) => {
            this.battlefield = data;
            this.drawerPort.load(data.tileTypes, () => {
                this.drawerPort.drawBattlefield(this.battlefield);
                this.drawerPort.drawUnits(this.unitStates);
            });
        });

        this.eventManager.listen(Events.ERROR, (error: any) => {
            // logger.logError(error);
        });

        this.eventManager.listen(Events.POSITIONS, (data: any) => {
            this.drawerPort.drawPositionsForMove(data.positions);
        });

        this.eventManager.listen(Events.ACTION_INFO, (data: any) => {
            this.drawerPort.drawPositionsForAction(data.positions);
        });

        this.eventManager.listen(Events.MOVE, (unitState: any) => {
            this.drawerPort.updateUnit(unitState);
            this.uiPort.hideEntry(Mode.MOVE);
        });

        this.eventManager.listen(Events.ACT, (unitStates: any[]) => {
            unitStates.forEach(unitState => this.drawerPort.updateUnit(unitState));
            this.uiPort.hideEntry(Mode.ACT);
        });

        this.eventManager.listen(Events.END_TURN, (battle: any) => {
            this.currentUnitState = battle.currentUnitState;
            this.drawerPort.updateUnits(battle.unitStates);
            this.uiPort.showEntry(Mode.MOVE);
            this.uiPort.showEntry(Mode.ACT);
            this.resetSelection();
        });

        this.eventManager.listen(Events.ROLLBACK_ACTION, (battle: any) => {
            this.drawerPort.updateUnits(battle.unitStates);
            this.currentUnitState = battle.currentUnitState;
            this.resetSelection();
            this.updateUI();
        });
    }

    onClickOnUnit() {
        return (unitState: any) => {
            if (!this.selectedUnitState) {
                this.selectedUnitState = unitState;
                const data: any = {
                    battleId: this.battleId,
                    unitId: unitState.unit.id
                };
                if (this.mode === Mode.MOVE) {
                    this.eventManager.dispatch(Events.ASK_POSITIONS, data);
                } else {
                    data.actionTypeId = "attack";
                    this.eventManager.dispatch(Events.ASK_ACTION_INFO, data);
                }
            } else if (this.selectedUnitState.unit.id !== unitState.unit.id) {
                this.onClickOnPosition()(unitState.position);
            }
        }
    }

    onClickOnPosition() {
        return (position: any) => {
            const data: any = {
                battleId: this.battleId,
                unitId: this.currentUnitState.unit.id,
                position: position
            };
            if (this.mode === Mode.MOVE
                && this.selectedUnitState.unit.id === this.currentUnitState.unit.id
                && !this.selectedUnitState.moved) {
                this.eventManager.dispatch(Events.ASK_MOVE, data);
            } else if (this.mode === Mode.ACT
                && this.selectedUnitState.unit.id === this.currentUnitState.unit.id
                && !this.selectedUnitState.acted) {
                data.actionTypeId = "attack";
                this.eventManager.dispatch(Events.ASK_ACT, data);
            }
            this.resetSelection();
        }
    }

    onMove() {
        return () => {
            this.mode = Mode.MOVE;
            this.resetSelection();
        }
    }

    onAttack() {
        return () => {
            this.mode = Mode.ACT;
            this.resetSelection();
        }
    }

    onNextTurn() {
        return () => {
            this.eventManager.dispatch(Events.ASK_END_TURN, this.battleId);
            this.resetSelection();
        }
    }

    onResetAction() {
        return () => {
            this.eventManager.dispatch(Events.ASK_ROLLBACK_ACTION, this.battleId);
            this.resetSelection();
        }
    }

    private resetSelection() {
        this.drawerPort.clearPositionTiles();
        this.selectedUnitState = undefined;
    }

    private updateUI() {
        this.currentUnitState.moved ? this.uiPort.hideEntry(Mode.MOVE) : this.uiPort.showEntry(Mode.MOVE);
        this.currentUnitState.moved ? this.uiPort.hideEntry(Mode.ACT) : this.uiPort.showEntry(Mode.ACT);
    }
}

