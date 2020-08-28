import { Mode } from "../enums";

export default interface UIDrawerPort {
    open(): void;
    close(): void;
    showEntry(mode: Mode): void;
    hideEntry(mode: Mode): void;
}