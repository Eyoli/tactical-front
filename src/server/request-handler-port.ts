type Position = { x: number, y: number, z: number };

interface RequestHandlerPort {
	rollbackAction(battleId: string): Promise<any>;
	endTurn(battleId: string): Promise<any>;
	getBattles(): Promise<any>;
	move(battleId: string, unitId: string, position: Position): Promise<any>;
	actionInfo(battleId: string, unitId: string, actionTypeId: string): Promise<any>;
	getPositions(battleId: string, unitId: string): Promise<any>;
    getBattle(battleId: string): Promise<any>;
    getBattlefield(battlefieldId: string): Promise<any>;
}

export { RequestHandlerPort, Position };