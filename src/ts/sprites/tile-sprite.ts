import * as PIXI from 'pixi.js';

export default class TileSprite extends PIXI.Sprite {
    private size: number;

    constructor(texture: PIXI.Texture, size: number) {
        super(texture);

        this.width = size;
        this.height = size;
        this.pivot.set(this.width / 2, this.height);
        this.size = size;
    }
}