import UIDrawerPort from "../../game/port/ui-drawer-port";
import {Mode} from "../../game/enums";

export default class FakeUIDrawer implements UIDrawerPort {

    close(): void {
    }

    open(unitState: any, active: boolean): void {
    }
}