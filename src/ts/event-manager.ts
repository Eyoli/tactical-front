import logger from "./logger";

export enum TacticalEvent {
    CLICK_ON_UNIT = "CLICK_ON_UNIT",
    CLICK_ON_POSITION = "CLICK_ON_POSITION",
    CLICK_ON_MENU_MOVE = "CLICK_ON_MENU_MOVE",
    CLICK_ON_MENU_ATTACK = "CLICK_ON_MENU_ATTACK",
    CLICK_ON_MENU_NEXT_TURN = "CLICK_ON_MENU_NEXT_TURN",
    CLICK_ON_MENU_RESET_TURN = "CLICK_ON_MENU_RESET_TURN",
    ASK_BATTLE = "ASK_BATTLE",
    ASK_FIELD = "ASK_FIELD",
    ASK_END_TURN = "ASK_END_TURN",
    ASK_ROLLBACK_ACTION = "ASK_ROLLBACK_ACTION",
    ASK_ACT = "ASK_ACT",
    ASK_MOVE = "ASK_MOVE",
    POSITIONS = "POSITIONS",
    ASK_ACTION_INFO = "ASK_ACTION_INFO",
    BATTLE = "BATTLE",
    FIELD = "FIELD",
    ASK_POSITIONS = "ASK_POSITIONS",
    ROLLBACK_ACTION = "ROLLBACK_ACTION",
    END_TURN = "END_TURN",
    ACTION_INFO = "ACTION_INFO",
    MOVE = "MOVE",
    ERROR = "ERROR",
    ACT = "ACT"
}

export class EventManager {
    private eventHolder: Map<TacticalEvent, Function>;

    constructor() {
        this.eventHolder = new Map();
    }

    listen(name: TacticalEvent, callback: Function): void {
        this.eventHolder.set(name, callback);
    }

    dispatch(name: TacticalEvent, ...data: any[]) {
        logger.logMessage(name.toString(), ...data);
        if (this.eventHolder.has(name)) {
            this.eventHolder.get(name)!(...data);
        }
    }
}