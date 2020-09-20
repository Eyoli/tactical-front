import * as PIXI from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';
import LifeBar from './life-bar';
import { Direction } from '../../game/enums';
import { Position } from '../../../server/request-handler-port';

const MODES = {
    IDLE: 'idle',
    MOVE: 'move'
};

export class UnitMode extends PIXI.Container {
    private readonly faces: Map<Direction, PIXI.DisplayObject>;

    constructor() {
        super();
        this.faces = new Map();
    }

    withFace(direction: Direction, displayObject: PIXI.DisplayObject) {
        this.faces.set(direction, displayObject);
        this.addChild(displayObject);
        displayObject.visible = false;
        return this;
    }

    face(direction: Direction) {
        this.faces.forEach((value: PIXI.DisplayObject, key: Direction) => {
            if (key === direction) {
                value.visible = true;
            } else {
                value.visible = false;
            }
        });
    }
}

export class UnitContainer extends PIXI.Container {
    readonly lifeBar: LifeBar;
    private readonly modes: Map<string, UnitMode>;

    constructor(size: number) {
        super();

        this.modes = new Map();

        // interactivity
        this.interactive = true;
        this.buttonMode = true;

        // life bar
        this.lifeBar = new LifeBar(size);
        this.lifeBar.y = -20;
        this.addChild(this.lifeBar);
    }

    withOutline(): UnitContainer {
        const outlineFilterBlue = new OutlineFilter(2, 0xff9999);
        this.on('pointerover', () => this.filters = [outlineFilterBlue]);
        this.on('pointerout', () => this.filters = []);
        return this;
    }

    withIdleMode(unitMode: UnitMode) {
        return this.withMode(MODES.IDLE, unitMode);
    }

    withMoveMode(unitMode: UnitMode) {
        return this.withMode(MODES.MOVE, unitMode);
    }

    idle(direction: Direction) {
        this.face(MODES.IDLE, direction);
    }

    move(direction: Direction) {
        this.face(MODES.MOVE, direction);
    }

    private withMode(mode: string, unitMode: UnitMode) {
        this.modes.set(mode, unitMode);
        this.addChild(unitMode);
        return this;
    }

    private face(mode: string, direction: Direction) {
        this.modes.forEach((value: UnitMode, key: string) => {
            if (key === mode) {
                value.visible = true;
                value.face(direction);
            } else {
                value.visible = false;
            }
        });
    }
}