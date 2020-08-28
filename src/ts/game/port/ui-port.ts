import { Mode } from "../enums";

export default interface UIPort {
    open(): void;
    close(): void;
    showEntry(mode: Mode): void;
    hideEntry(mode: Mode): void;
}