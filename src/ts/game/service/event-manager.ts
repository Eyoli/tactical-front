import logger from "./logger";
import { Events } from "../enums";

type EventListener = (...args: any[]) => void;

export default class EventManager {
    private eventHolder: Map<Events, EventListener[]>;

    constructor() {
        this.eventHolder = new Map();
    }

    listen(name: Events, listener: EventListener): void {
        let listeners = this.eventHolder.get(name);
        if (!listeners) {
            listeners = [];
            this.eventHolder.set(name, listeners);
        }
        listeners.push(listener);
    }

    dispatch(name: Events, ...data: any[]) {
        logger.logMessage(name.toString(), ...data);
        if (this.eventHolder.has(name)) {
            this.eventHolder.get(name)!.forEach(listener => listener(...data));
        }
    }
}