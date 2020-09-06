export enum Mode { MOVE, ACT };

export enum Events {
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

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}