import UIDrawerPort from "../../game/port/ui-port";
import {Mode} from "../../game/enums";

export default class FakeUIDrawer implements UIDrawerPort {
    showMoveEntry: boolean = true;
    showActEntry: boolean = true;

    close(): void {
    }

    hideEntry(mode: Mode): void {
        if (mode === Mode.MOVE) {
            this.showMoveEntry = false;
        } else if (mode === Mode.ACT) {
            this.showActEntry = false;
        }
    }

    open(): void {
    }

    showEntry(mode: Mode): void {
        if (mode === Mode.MOVE) {
            this.showMoveEntry = true;
        } else if (mode === Mode.ACT) {
            this.showActEntry = true;
        }
    }

}