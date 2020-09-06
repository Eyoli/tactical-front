import * as PIXI from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';
import LifeBar from './life-bar';
import { Direction } from '../../game/enums';

export default class UnitContainer extends PIXI.Container {
    readonly lifeBar: LifeBar;
    private faces: Map<Direction, PIXI.DisplayObject>;

    constructor(size: number) {
        super();

        this.faces = new Map();

        // interactivity
        this.interactive = true;
        this.buttonMode = true;

        // life bar
        this.lifeBar = new LifeBar(size);
        this.lifeBar.y = -20;
        this.addChild(this.lifeBar);
    }

    withFace(direction: Direction, displayObject: PIXI.DisplayObject): UnitContainer {
        this.faces.set(direction, displayObject);
        this.addChild(displayObject);
        displayObject.visible = false;
        return this;
    }

    withOutline(): UnitContainer {
        const outlineFilterBlue = new OutlineFilter(2, 0xff9999);
        this.on('pointerover', () => this.filters = [outlineFilterBlue]);
        this.on('pointerout', () => this.filters = []);
        return this;
    }

    face(direction: Direction): void {
        this.faces.forEach((value: PIXI.DisplayObject, key: Direction) => {
            if (key === direction) {
                value.visible = true;
            } else {
                value.visible = false;
            }
        });
    }

    onClick(callback: Function) {
        this.on('pointerdown', callback);
    }
}