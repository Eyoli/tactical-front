const SocketManager = (() => {
    let battlefield = null;
    let unitStates = null;
    let selectedUnitId = null;

    return {
        init: function () {
            const socket = io('http://localhost:3001');

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const battleId = urlParams.get('id');

            socket.emit("battle", battleId);

            socket.on("battle", (data) => {
                console.log(data);
                unitStates = data.unitStates;
                if (data.fieldId && !battlefield) {
                    socket.emit("battlefield", data.fieldId);
                }
            });

            socket.on("battlefield", (data) => {
                console.log(data);
                battlefield = data;
                Drawer.load(data.tileTypes, () => {
                    Drawer.drawBattlefield(battlefield);
                    Drawer.drawUnits(unitStates, onClickOnUnit);
                });
            });

            socket.on("battle-error", (error) => {
                console.error(error);
            });

            socket.on("positions", (positions) => {
                console.log(positions);
                Drawer.drawPositions(positions, onClickOnPosition);
            });

            socket.on("move", (unitState) => {
                console.log(unitState);
                Drawer.clearPositionTiles();
                Drawer.updateUnit(unitState);
                socket.emit("endTurn", battleId);
            });

            socket.on("endTurn", (battle) => {
                console.log("END TURN", battle);
            });

            function onClickOnUnit(unitState) {
                console.log(unitState);
                selectedUnitId = unitState.unit.id;
                socket.emit("positions", {
                    battleId: battleId,
                    unitId: selectedUnitId
                });
            }

            function onClickOnPosition(position) {
                socket.emit("move", {
                    battleId: battleId,
                    unitId: selectedUnitId,
                    position: position
                });
            }
        }
    }
}) ();

