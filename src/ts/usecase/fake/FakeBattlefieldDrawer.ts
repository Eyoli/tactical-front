import BattlefieldDrawerPort from "../../game/port/battlefield-drawer-port";
import { UnitState } from "../../game/types";

export default class FakeBattlefieldDrawer implements BattlefieldDrawerPort {
    battleStarted = false;
    positionsForMoveDrawn = false;
    positionsForActionDrawn = false;
    unitUpdatedAfterMove = false;
    unitUpdatedAfterAction = false;
    unitsUpdated = false;
    areaDrawingActivated = false;
    unitMoved = false;

    constructor() {
        //
    }

    moveUnit(unitState: any): void {
        this.unitMoved = true;
    }

    clearPositionTiles(): void {
        //
    }

    drawDamage(unitStates: any, damage: number): void {
        //
    }

    drawPositionsForAction(positions: any): void {
        this.positionsForActionDrawn = true;
    }

    drawPositionsForMove(positions: any): void {
        this.positionsForMoveDrawn = true;
    }

    startNewBattle(field: any, unitStates: any): void {
        this.battleStarted = true;
    }

    updateUnit(unitState: UnitState): void {
        if (unitState.moved) {
            this.unitUpdatedAfterMove = true;
        } else if (unitState.acted) {
            this.unitUpdatedAfterAction = true;
        }
    }

    updateUnits(unitStates: any): void {
        this.unitsUpdated = true;
    }

    activateAreaDrawing(actionType: any): void {
        this.areaDrawingActivated = true;
    }

}