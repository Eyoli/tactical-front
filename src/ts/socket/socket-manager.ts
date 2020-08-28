import EventManager from "../game/service/event-manager";
import io from 'socket.io-client';
import { Events } from "../game/enums";

export default class SocketManager {

    constructor(eventManager: EventManager) {
        const socket = io('http://localhost:3001');

        eventManager.listen(Events.ASK_BATTLE,
            (data: any) => socket.emit("battle", data));

        socket.on("battle",
            (data: any) => eventManager.dispatch(Events.BATTLE, data));

        eventManager.listen(Events.ASK_FIELD,
            (data: any) => socket.emit("battlefield", data));

        socket.on("battlefield",
            (data: any) => eventManager.dispatch(Events.FIELD, data));

        eventManager.listen(Events.ASK_POSITIONS,
            (data: any) => socket.emit("positions", data));

        socket.on("positions",
            (data: any) => eventManager.dispatch(Events.POSITIONS, data));

        eventManager.listen(Events.ASK_END_TURN,
            (data: any) => socket.emit("endTurn", data));

        socket.on("endTurn",
            (data: any) => eventManager.dispatch(Events.END_TURN, data));

        eventManager.listen(Events.ASK_ROLLBACK_ACTION,
            (data: any) => socket.emit("rollbackAction", data));

        socket.on("rollbackAction",
            (data: any) => eventManager.dispatch(Events.ROLLBACK_ACTION, data));

        eventManager.listen(Events.ASK_MOVE,
            (data: any) => socket.emit("move", data));

        socket.on("move",
            (data: any) => eventManager.dispatch(Events.MOVE, data));

        eventManager.listen(Events.ASK_ACT,
            (data: any) => socket.emit("act", data));

        socket.on("act",
            (data: any) => eventManager.dispatch(Events.ACT, data));

        eventManager.listen(Events.ASK_ACTION_INFO,
            (data: any) => socket.emit("actionInfo", data));

        socket.on("actionInfo",
            (data: any) => eventManager.dispatch(Events.ACTION_INFO, data));

        socket.on("battle-error",
            (data: any) => eventManager.dispatch(Events.ERROR, data));
    }
}