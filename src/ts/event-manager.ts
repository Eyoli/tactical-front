export enum TacticalEvent {
    EVENT_CLICK_ON_UNIT,
    EVENT_CLICK_ON_POSITION,
    EVENT_CLICK_ON_MENU_MOVE,
    EVENT_CLICK_ON_MENU_ATTACK,
    EVENT_CLICK_ON_MENU_NEXT_TURN,
    EVENT_CLICK_ON_MENU_RESET_TURN
}

export class EventManager {
    private eventHolder: Map<TacticalEvent, Function>;

    constructor() {
        this.eventHolder = new Map();
    }

    addEventListener(name: TacticalEvent, callback: Function): void {
        this.eventHolder.set(name, callback);
    }

    dispatchEvent(name: TacticalEvent, ...data: any[]) {
        if (this.eventHolder.has(name)) {
            this.eventHolder.get(name)!(...data);
        }
    }
}