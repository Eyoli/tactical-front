import * as PIXI from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';
import LifeBar from './life-bar';
import { Direction } from '../../game/enums';

const MODES = {
    IDLE: 'idle',
    MOVE: 'move'
};

export class UnitMode extends PIXI.Container {
    private readonly faces: Map<Direction, PIXI.AnimatedSprite>;

    constructor() {
        super();
        this.faces = new Map();
    }

    withFace(direction: Direction, displayObject: PIXI.AnimatedSprite): UnitMode {
        this.faces.set(direction, displayObject);
        this.addChild(displayObject);
        displayObject.visible = false;
        return this;
    }

    face(direction: Direction): PIXI.AnimatedSprite | undefined {
        this.faces.forEach((value: PIXI.AnimatedSprite, key: Direction) => {
            if (key === direction) {
                value.visible = true;
            } else {
                value.visible = false;
            }
        });
        return this.faces.get(direction);
    }
}

export class UnitContainer extends PIXI.Container {
    readonly lifeBar: LifeBar;
    private readonly modes: Map<string, UnitMode>;
    private direction: Direction = Direction.LEFT;

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

    withIdleMode(unitMode: UnitMode): UnitContainer {
        return this.withMode(MODES.IDLE, unitMode);
    }

    withMoveMode(unitMode: UnitMode): UnitContainer {
        return this.withMode(MODES.MOVE, unitMode);
    }

    idle(direction?: Direction): void {
        this.face(MODES.IDLE, direction || this.direction);
    }

    move(direction?: Direction): void {
        const animated = this.face(MODES.MOVE, direction || this.direction);
        animated?.gotoAndPlay(0);
    }

    private withMode(mode: string, unitMode: UnitMode): UnitContainer {
        this.modes.set(mode, unitMode);
        this.addChild(unitMode);
        return this;
    }

    private face(mode: string, direction: Direction) {
        this.direction = direction;
        this.modes.forEach((value: UnitMode) => {
            value.visible = false;
        });
        const unitMode = this.modes.get(mode);
        if (unitMode) {
            unitMode.visible = true;
            return unitMode.face(direction);
        }
    }
}