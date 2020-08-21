function prepareNextAnimation(unitSprite) {
    unitSprite.gotoAndPlay(0);
    setTimeout(() => prepareNextAnimation(unitSprite), 3000 + Math.random() * 2000);
}

class UnitSprite extends PIXI.AnimatedSprite {

    constructor(textures) {
        super(textures);

        this.width = this.texture.width;
        this.height = this.texture.height;
        this.pivot.set(this.width / 2, this.height);

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

        this.pivot.set(size / 2, size / 2);
        this.width = size;
        this.height = size;
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