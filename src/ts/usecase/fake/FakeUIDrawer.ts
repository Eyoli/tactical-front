import UIDrawerPort from "../../game/port/ui-port";
import {Mode} from "../../game/enums";

export default class FakeUIDrawer implements UIDrawerPort {

    close(): void {
    }

    open(unitState: any): void {
    }
}