import { UnitState } from "../types";

export default interface UIDrawerPort {
    open(unitState: UnitState, active: boolean): void;
    close(): void;
}