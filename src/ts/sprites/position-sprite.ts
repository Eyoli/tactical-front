import * as PIXI from 'pixi.js';

export default class PositionSprite extends PIXI.Graphics {

    constructor(tileSprite: PIXI.Sprite, color: number, onClick?: Function) {
        super();

        this.lineStyle(0);
        this.beginFill(color, 0.5);
        this.drawPolygon([
            0, tileSprite.height / 4,
            tileSprite.width / 2, 0,
            tileSprite.width, tileSprite.height / 4,
            tileSprite.width / 2, tileSprite.height / 2,
        ]);
        this.endFill();
        this.pivot.set(this.width / 2, 2 * this.height);
        this.zIndex = this.zIndex;
    }

    triggerOnClick(callback: Function) {
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', callback);
    }
}