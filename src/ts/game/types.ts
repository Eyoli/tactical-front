import { Direction } from "./enums";

export type Position = Readonly<{x: number, y: number, z: number}>;

export type Statistics = Readonly<{
    health: number
}>;

export type HistorizedValue = Readonly<{current: number, last: number}>;

export type UnitState = Readonly<{
    unit: {
        id: string,
        statistics: Statistics
    },
    direction: Direction,
    health: HistorizedValue,
    position: Position,
    path: Position[]
    moved: boolean,
    acted: boolean
}>;