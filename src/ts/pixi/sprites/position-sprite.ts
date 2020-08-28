import * as PIXI from 'pixi.js';

export default class PositionSprite extends PIXI.Graphics {

    constructor(width: number, height: number, color: number, alpha: number = 0.5) {
        super();

        this.lineStyle(0);
        this.beginFill(color, alpha);
        this.drawPolygon([
            0, height / 4,
            width / 2, 0,
            width, height / 4,
            width / 2, height / 2,
        ]);
        this.endFill();
    }

    onClick(callback: Function) {
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', callback);
    }
}