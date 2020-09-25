import EventManager from "./event-manager";
import BattlefieldDrawerPort from "../port/battlefield-drawer-port";
import UIDrawerPort from "../port/ui-drawer-port";
import { Mode, Events } from "../enums";
import { UnitState } from "../types";
import { Position } from "../../../server/request-handler-port";

export default class GameManager {
    private eventManager: EventManager;
    private drawerPort: BattlefieldDrawerPort;
    private uiPort: UIDrawerPort;

    private unitStates!: UnitState[];
    private battlefield: any;
    private battleId!: string;
    private mode: Mode = Mode.MOVE;
    private currentUnitState!: UnitState;
    private selectedUnitState?: UnitState;

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

        this.eventManager.listen(Events.MOVE, (unitState: UnitState) => {
            this.drawerPort.moveUnit(unitState);
        });

        this.eventManager.listen(Events.ACT, (unitStates: UnitState[]) => {
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

        this.eventManager.listen(Events.CLICK_ON_CLOSE_MENU, () => {
            this.uiPort.close();
            this.selectedUnitState = undefined;
        });
    }

    onClickOnUnit(unitState: UnitState): void {
        if (!this.selectedUnitState) {
            this.selectedUnitState = unitState;
            this.uiPort.open(unitState, this.isSelectedUnit(this.currentUnitState));
        } else if (!this.isSelectedUnit(unitState) && this.mode === Mode.ACT) {
            this.onClickOnPosition(unitState.position);
        }
    }

    onClickOnPosition(position: Position): void {
        const data: any = {
            battleId: this.battleId,
            unitId: this.currentUnitState.unit.id,
            position: position
        };
        if (this.mode === Mode.MOVE
            && this.isSelectedUnit(this.currentUnitState)
            && this.selectedUnitState?.moved === false) {
            this.eventManager.dispatch(Events.ASK_MOVE, data);
        } else if (this.mode === Mode.ACT
            && this.isSelectedUnit(this.currentUnitState)
            && this.selectedUnitState?.acted === false) {
            data.actionTypeId = "attack";
            this.eventManager.dispatch(Events.ASK_ACT, data);
        }
        this.resetSelection();
    }

    onMove(): void {
        this.mode = Mode.MOVE;
        this.uiPort.close();
        const data: any = {
            battleId: this.battleId,
            unitId: this.selectedUnitState!.unit.id
        };
        this.eventManager.dispatch(Events.ASK_POSITIONS, data);
    }

    onAttack(): void {
        this.mode = Mode.ACT;
        this.uiPort.close();
        const data: any = {
            battleId: this.battleId,
            unitId: this.selectedUnitState!.unit.id,
            actionTypeId: "attack"
        };
        this.eventManager.dispatch(Events.ASK_ACTION_INFO, data);
    }

    onNextTurn(): void {
        this.eventManager.dispatch(Events.ASK_END_TURN, this.battleId);
        this.uiPort.close();
        this.resetSelection();
    }

    onResetAction(): void {
        this.eventManager.dispatch(Events.ASK_ROLLBACK_ACTION, this.battleId);
        this.uiPort.close();
        this.resetSelection();
    }

    private resetSelection() {
        this.drawerPort.clearPositionTiles();
        this.selectedUnitState = undefined;
    }

    private isSelectedUnit(unitState: UnitState): boolean {
        return this.selectedUnitState?.unit.id === unitState.unit.id;
    }
}

