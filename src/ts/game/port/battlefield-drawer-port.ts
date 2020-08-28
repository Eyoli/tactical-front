export default interface BattlefieldDrawerPort {
    drawPositionsForMove(positions: any): void;
    drawPositionsForAction(positions: any): void;
    updateUnit(unitState: any): void;
    clearPositionTiles(): void;
    updateUnits(unitStates: any): void;
    startNewBattle(field: any, unitStates: any): void;
    drawField(battlefield: any) : void;
    drawUnits(unitStates: any): void;
    drawDamage(unitStates: any, damage: number): void;
}