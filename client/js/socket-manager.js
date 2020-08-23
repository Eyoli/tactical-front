const SocketManager = (() => {
    let battlefield = null;
    let unitStates = null;
    let selectedUnitId = null;
    let ui = null;

    return {
        init: function (tacticalUI) {
            ui = tacticalUI;

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
                    ui.drawNextTurnButton(onClickOnNextTurnButton);
                    ui.drawResetTurnButton(onClickOnResetTurnButton);
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
                Drawer.updateUnit(unitState, onClickOnUnit);
            });

            socket.on("endTurn", (battle) => {
                Drawer.clearPositionTiles();
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

            function onClickOnNextTurnButton() {
                socket.emit("endTurn", battleId);
            }

            function onClickOnResetTurnButton() {
                socket.emit("resetTurn", battleId);
            }
        }
    }
}) ();

