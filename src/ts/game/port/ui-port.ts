import { Mode } from "../enums";

export default interface UIDrawerPort {
    open(unitState: any): void;
    close(): void;
}