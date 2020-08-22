function prepareNextAnimation(unitSprite) {
    unitSprite.gotoAndPlay(0);
    setTimeout(() => prepareNextAnimation(unitSprite), 3000 + Math.random() * 2000);
}

class UnitSprite extends PIXI.AnimatedSprite {

    constructor(textures, size) {
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

        prepareNextAnimation(this);
    }

    onClick(callback) {
        this.on('pointerdown', callback);
    }
}

class TileSprite extends PIXI.Sprite {

    constructor(texture, size) {
        super(texture);

        this.width = size;
        this.height = size;
        this.pivot.set(this.width / 2, this.height);
        this.size = size;
    }
}

class PositionTileSprite extends TileSprite {

    constructor(texture, size) {
        super(texture, size);

        // interactivity
        this.interactive = true;
        this.buttonMode = true;
    }

    getMask() {
        if (!this.mask) {
            const mask = new PIXI.Graphics();
            mask.lineStyle(0);
            mask.beginFill(0x3500FA, 1);
            mask.drawPolygon([
                this.x, this.y + this.size / 4,
                this.x + this.size / 2, this.y,
                this.x + this.size, this.y + this.size / 4,
                this.x + this.size / 2, this.y + this.size / 2,
            ]);
            mask.endFill();
            mask.pivot.set(this.width / 2, this.height);
            mask.zIndex = this.zIndex;
            this.mask = mask;
        }

        return this.mask;
    }
}

class PositionResolver {
    constructor(spatialStep) {
        this.spatialStep = spatialStep;
    }

    resolve(i, j, k) {
        return {
            x: (j - i) * this.spatialStep.x,
            y: (j + i) * this.spatialStep.y + k * this.spatialStep.z
        };
    }
}