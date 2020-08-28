export default interface DrawerPort {
    drawPositionsForMove(positions: any): void;
    drawPositionsForAction(positions: any): void;
    updateUnit(unitState: any): void;
    clearPositionTiles(): void;
    updateUnits(unitStates: any): void;
    load(tileTypes: any[], callback: any): void;
    drawBattlefield(battlefield: any) : void;
    drawUnits(unitStates: any): void;
}