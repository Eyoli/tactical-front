import { EventManager, TacticalEvent } from "./event-manager";
import io from 'socket.io-client';

export default class SocketManager {

    constructor(eventManager: EventManager) {
        const socket = io('http://localhost:3001');

        eventManager.listen(TacticalEvent.ASK_BATTLE,
            (data: any) => socket.emit("battle", data));

        socket.on("battle",
            (data: any) => eventManager.dispatch(TacticalEvent.BATTLE, data));

        eventManager.listen(TacticalEvent.ASK_FIELD,
            (data: any) => socket.emit("battlefield", data));

        socket.on("battlefield",
            (data: any) => eventManager.dispatch(TacticalEvent.FIELD, data));

        eventManager.listen(TacticalEvent.ASK_POSITIONS,
            (data: any) => socket.emit("positions", data));

        socket.on("positions",
            (data: any) => eventManager.dispatch(TacticalEvent.POSITIONS, data));

        eventManager.listen(TacticalEvent.ASK_END_TURN,
            (data: any) => socket.emit("endTurn", data));

        socket.on("endTurn",
            (data: any) => eventManager.dispatch(TacticalEvent.END_TURN, data));

        eventManager.listen(TacticalEvent.ASK_ROLLBACK_ACTION,
            (data: any) => socket.emit("rollbackAction", data));

        socket.on("rollbackAction",
            (data: any) => eventManager.dispatch(TacticalEvent.ROLLBACK_ACTION, data));

        eventManager.listen(TacticalEvent.ASK_MOVE,
            (data: any) => socket.emit("move", data));

        socket.on("move",
            (data: any) => eventManager.dispatch(TacticalEvent.MOVE, data));

        eventManager.listen(TacticalEvent.ASK_ACT,
            (data: any) => socket.emit("act", data));

        socket.on("act",
            (data: any) => eventManager.dispatch(TacticalEvent.ACT, data));

        eventManager.listen(TacticalEvent.ASK_ACTION_INFO,
            (data: any) => socket.emit("actionInfo", data));

        socket.on("actionInfo",
            (data: any) => eventManager.dispatch(TacticalEvent.ACTION_INFO, data));

        socket.on("battle-error",
            (data: any) => eventManager.dispatch(TacticalEvent.ERROR, data));
    }
}