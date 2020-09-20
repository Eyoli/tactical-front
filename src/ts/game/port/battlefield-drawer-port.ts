import { UnitState, Position } from "../types";

export default interface BattlefieldDrawerPort {
    moveUnit(unitState: UnitState): void;
    activateAreaDrawing(actionType: any): void;
    drawPositionsForMove(positions: Position[]): void;
    drawPositionsForAction(positions: Position[]): void;
    updateUnit(unitState: UnitState): void;
    clearPositionTiles(): void;
    updateUnits(unitStates: UnitState[]): void;
    startNewBattle(field: any, unitStates: UnitState[]): void;
    drawDamage(unitState: UnitState, damage: number): void;
    activateAreaDrawing(actionType: any): void;
}