import * as PIXI from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';
import LifeBar from './life-bar';

function prepareNextAnimation(unitSprite: PIXI.AnimatedSprite) {
    unitSprite.gotoAndPlay(0);
    setTimeout(() => prepareNextAnimation(unitSprite), 3000 + Math.random() * 2000);
}

export class UnitSprite extends PIXI.AnimatedSprite {
    lifeBar: LifeBar;

    constructor(textures: PIXI.Texture[], size: number) {
        super(textures);

        this.width = this.texture.width;
        this.height = this.texture.height;
        this.pivot.set(this.width / 2, this.height);
        const scale = size / this.width;
        this.scale.set(scale, scale);

        // animation
        this.animationSpeed = 0.1;
        this.loop = false;

        // interactivity
        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new PIXI.Polygon([
            textures[0].trim.x, textures[0].trim.y,
            textures[0].trim.x + textures[0].trim.width, textures[0].trim.y,
            textures[0].trim.x + textures[0].trim.width, textures[0].trim.y + textures[0].trim.height,
            textures[0].trim.x, textures[0].trim.y + textures[0].trim.height
        ]);

        // life bar
        this.lifeBar = new LifeBar(1.2 * this.width);
        this.lifeBar.x = 0;
        this.lifeBar.y = this.texture.height;
        this.addChild(this.lifeBar);

        prepareNextAnimation(this);
    }

    withOutline() {
        const outlineFilterBlue = new OutlineFilter(2, 0xff9999);
        this.on('pointerover', () => this.filters = [outlineFilterBlue]);
        this.on('pointerout', () => this.filters = []);
        return this;
    }

    onClick(callback: Function) {
        this.on('pointerdown', callback);
    }
}

export class Fluffy extends UnitSprite {
    private static fluffyTextures: PIXI.Texture[];

    constructor(size: number) {
        super(Fluffy.getTexture(), size);
    }

    private static getTexture() {
        if (!this.fluffyTextures) {
            this.fluffyTextures = [];
            for (let i = 0; i < 8; i++) {
                const fluffyTexture = PIXI.Texture.from("fluffy-red-" + i + ".png");
                this.fluffyTextures.push(fluffyTexture);
            }
            this.fluffyTextures.push(PIXI.Texture.from("fluffy-red-0.png"));
        }
        return this.fluffyTextures;
    }
}