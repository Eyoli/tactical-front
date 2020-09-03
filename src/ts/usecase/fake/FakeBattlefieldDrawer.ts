import BattlefieldDrawerPort from "../../game/port/battlefield-drawer-port";

export default class FakeBattlefieldDrawer implements BattlefieldDrawerPort {
    battleStarted: boolean = false;
    positionsForMoveDrawn: boolean = false;
    positionsForActionDrawn: boolean = false;
    unitUpdatedAfterMove: boolean = false;
    unitUpdatedAfterAction: boolean = false;
    unitsUpdated: boolean = false;
    areaDrawingActivated: boolean = false;

    constructor() {
    }

    clearPositionTiles(): void {
    }

    drawDamage(unitStates: any, damage: number): void {
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

    updateUnit(unitState: any): void {
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