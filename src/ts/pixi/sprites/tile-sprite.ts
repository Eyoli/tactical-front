import * as PIXI from 'pixi.js';

export default class TileSprite extends PIXI.Sprite {

    constructor(texture: PIXI.Texture, size: number) {
        super(texture);

        this.width = size;
        this.height = size;
    }
}