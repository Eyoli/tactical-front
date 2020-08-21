const SocketManager = (() => {
    let battlefield = null;
    let unitStates = null;

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
            });

            function onClickOnUnit(unitState) {
                console.log(unitState);
                socket.emit("positions", {
                    battleId: battleId,
                    unitId: unitState.unit.id
                });
            }
        }
    }
}) ();

