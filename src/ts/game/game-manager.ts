import EventManager from "./service/event-manager";
import BattlefieldDrawerPort from "./port/battlefield-drawer-port";
import UIDrawerPort from "./port/ui-port";
import { Mode, Events } from "./enums";

export default class GameManager {
    private eventManager: EventManager;
    private drawerPort: BattlefieldDrawerPort;
    private uiPort: UIDrawerPort;

    private unitStates: any;
    private battlefield: any;
    private currentUnitState: any;
    private battleId: any;
    private mode: Mode = Mode.MOVE;
    private selectedUnitState?: any;

    constructor(drawerPort: BattlefieldDrawerPort, uiPort: UIDrawerPort, eventManager: EventManager) {
        this.drawerPort = drawerPort;
        this.uiPort = uiPort;
        this.eventManager = eventManager;

        this.eventManager.listen(Events.CLICK_ON_UNIT, this.onClickOnUnit.bind(this));
        this.eventManager.listen(Events.CLICK_ON_POSITION, this.onClickOnPosition.bind(this));
        this.eventManager.listen(Events.CLICK_ON_MENU_MOVE, this.onMove.bind(this));
        this.eventManager.listen(Events.CLICK_ON_MENU_ATTACK, this.onAttack.bind(this));
        this.eventManager.listen(Events.CLICK_ON_MENU_NEXT_TURN, this.onNextTurn.bind(this));
        this.eventManager.listen(Events.CLICK_ON_MENU_RESET_TURN, this.onResetAction.bind(this));

        this.eventManager.listen(Events.BATTLE, (battle: any) => {
            this.battleId = battle.id;
            this.unitStates = battle.unitStates;
            this.currentUnitState = battle.currentUnitState;
            if (battle.fieldId && !this.battlefield) {
                this.eventManager.dispatch(Events.ASK_FIELD, battle.fieldId);
            }
        });

        this.eventManager.listen(Events.FIELD, (data: any) => {
            this.battlefield = data;
            this.drawerPort.startNewBattle(this.battlefield, this.unitStates);
        });

        this.eventManager.listen(Events.ERROR, (error: any) => {
            // logger.logError(error);
        });

        this.eventManager.listen(Events.POSITIONS, (data: any) => {
            this.drawerPort.drawPositionsForMove(data.positions);
        });

        this.eventManager.listen(Events.ACTION_INFO, (data: any) => {
            this.drawerPort.drawPositionsForAction(data.positions);
            if (data.actionType.area) {
                this.drawerPort.activateAreaDrawing(data.actionType);
            }
        });

        this.eventManager.listen(Events.MOVE, (unitState: any) => {
            this.drawerPort.updateUnit(unitState);
        });

        this.eventManager.listen(Events.ACT, (unitStates: any[]) => {
            unitStates.forEach(unitState => this.drawerPort.updateUnit(unitState));
            unitStates
                .filter(unitState => unitState.health.current - unitState.health.last !== 0)
                .forEach(unitState => this.drawerPort.drawDamage(
                    unitState,
                    unitState.health.current - unitState.health.last));
        });

        this.eventManager.listen(Events.END_TURN, (battle: any) => {
            this.currentUnitState = battle.currentUnitState;
            this.drawerPort.updateUnits(battle.unitStates);
            this.resetSelection();
        });

        this.eventManager.listen(Events.ROLLBACK_ACTION, (battle: any) => {
            this.currentUnitState = battle.currentUnitState;
            this.drawerPort.updateUnits(battle.unitStates);
            this.resetSelection();
        });
    }

    onClickOnUnit(unitState: any) {
        if (!this.selectedUnitState) {
            this.selectedUnitState = unitState;
            this.uiPort.open(unitState);
        } else if (!this.isSelectedUnit(unitState)) {
            this.onClickOnPosition(unitState.position);
        }
    }

    onClickOnPosition(position: any) {
        const data: any = {
            battleId: this.battleId,
            unitId: this.currentUnitState.unit.id,
            position: position
        };
        if (this.mode === Mode.MOVE
            && this.isSelectedUnit(this.currentUnitState)
            && !this.selectedUnitState.moved) {
            this.eventManager.dispatch(Events.ASK_MOVE, data);
        } else if (this.mode === Mode.ACT
            && this.isSelectedUnit(this.currentUnitState)
            && !this.selectedUnitState.acted) {
            data.actionTypeId = "attack";
            this.eventManager.dispatch(Events.ASK_ACT, data);
        }
        this.resetSelection();
    }

    onMove() {
        this.mode = Mode.MOVE;
        this.uiPort.close();
        const data: any = {
            battleId: this.battleId,
            unitId: this.selectedUnitState.unit.id
        };
        this.eventManager.dispatch(Events.ASK_POSITIONS, data);
    }

    onAttack() {
        this.mode = Mode.ACT;
        this.uiPort.close();
        const data: any = {
            battleId: this.battleId,
            unitId: this.selectedUnitState.unit.id,
            actionTypeId: "attack"
        };
        this.eventManager.dispatch(Events.ASK_ACTION_INFO, data);
    }

    onNextTurn() {
        this.eventManager.dispatch(Events.ASK_END_TURN, this.battleId);
        this.resetSelection();
    }

    onResetAction() {
        this.eventManager.dispatch(Events.ASK_ROLLBACK_ACTION, this.battleId);
        this.resetSelection();
    }

    private resetSelection() {
        this.drawerPort.clearPositionTiles();
        this.selectedUnitState = undefined;
    }

    private isSelectedUnit(unitState: any): boolean {
        return this.selectedUnitState.unit.id === unitState.unit.id;
    }
}

