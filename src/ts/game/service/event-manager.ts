import logger from "./logger";
import { Events } from "../enums";

export default class EventManager {
    private eventHolder: Map<Events, Function>;

    constructor() {
        this.eventHolder = new Map();
    }

    listen(name: Events, callback: Function): void {
        this.eventHolder.set(name, callback);
    }

    dispatch(name: Events, ...data: any[]) {
        logger.logMessage(name.toString(), ...data);
        if (this.eventHolder.has(name)) {
            this.eventHolder.get(name)!(...data);
        }
    }
}