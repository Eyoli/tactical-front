import * as PIXI from 'pixi.js';

export default class Marker extends PIXI.Graphics {

    constructor(width: number, height: number, color: number, alpha = 0.5) {
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

    onClick(callback: () => void): void {
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', callback);
    }
}