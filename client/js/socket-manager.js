class SocketManager {
    static unitStates;
    static battlefield;
    static selectedUnitId;
    static battleId;
    static socket;
    static drawer;

    constructor() {
    }

    static init(drawer, ui) {
        const socket = io('http://localhost:3001');

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        SocketManager.battleId = urlParams.get('id');
        SocketManager.drawer = drawer;

        socket.emit("battle", SocketManager.battleId);

        socket.on("battle", (data) => {
            console.log(data);
            SocketManager.unitStates = data.unitStates;
            if (data.fieldId && !SocketManager.battlefield) {
                socket.emit("battlefield", data.fieldId);
            }
        });

        socket.on("battlefield", (data) => {
            console.log(data);
            SocketManager.battlefield = data;
            SocketManager.drawer.load(data.tileTypes, () => {
                SocketManager.drawer.drawBattlefield(SocketManager.battlefield);
                SocketManager.drawer.drawUnits(SocketManager.unitStates, SocketManager.onClickOnUnit);
                ui.drawNextTurnButton(SocketManager.onClickOnNextTurnButton);
                ui.drawResetTurnButton(SocketManager.onClickOnResetTurnButton);
            });
        });

        socket.on("battle-error", (error) => {
            console.error(error);
        });

        socket.on("positions", (positions) => {
            console.log(positions);
            SocketManager.drawer.drawPositions(positions, SocketManager.onClickOnPosition);
        });

        socket.on("move", (unitState) => {
            console.log(unitState);
            SocketManager.drawer.clearPositionTiles();
            SocketManager.drawer.updateUnit(unitState, SocketManager.onClickOnUnit);
        });

        socket.on("endTurn", (battle) => {
            SocketManager.drawer.clearPositionTiles();
            console.log("END TURN", battle);
        });

        socket.on("rollbackAction", (battle) => {
            SocketManager.drawer.clearPositionTiles();
            battle.unitStates.forEach(
                unitState => SocketManager.drawer.updateUnit(unitState, SocketManager.onClickOnUnit));
            console.log("ROLLBACK ACTION", battle);
        });

        SocketManager.socket = socket;
    }

    static onClickOnUnit(unitState) {
        console.log(unitState);
        SocketManager.selectedUnitId = unitState.unit.id;
        SocketManager.socket.emit("positions", {
            battleId: SocketManager.battleId,
            unitId: SocketManager.selectedUnitId
        });
    }

    static onClickOnPosition(position) {
        SocketManager.socket.emit("move", {
            battleId: SocketManager.battleId,
            unitId: SocketManager.selectedUnitId,
            position: position
        });
    }

    static onClickOnNextTurnButton() {
        SocketManager.socket.emit("endTurn", SocketManager.battleId);
    }

    static onClickOnResetTurnButton() {
        SocketManager.socket.emit("rollbackAction", SocketManager.battleId);
    }
}

