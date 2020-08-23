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
        this.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    }

    getMask() {
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

class WaterEffect {

    constructor(app) {
        const dContainer = new PIXI.Container();
        const dRenderTexture = PIXI.RenderTexture.create(app.renderer.width, app.renderer.height);
        const ripplesR = WaterEffect.createRipples(app.renderer.width, app.renderer.height, 0, 6);
        const ripplesG = WaterEffect.createRipples(app.renderer.width, app.renderer.height, 1, 7);
        this.displacementSprite = new PIXI.Sprite(dRenderTexture);

        dContainer.addChild(ripplesR);
        dContainer.addChild(ripplesG);

        const blurFilter = new PIXI.filters.BlurFilter(15, 3, 1);
        dContainer.filters = [blurFilter];

        const xformR = new PIXI.Transform();
        const xformG = new PIXI.Transform();
        let phase = 0;
        xformR.position.set(app.renderer.width * 0.5, app.renderer.height * 0.25);
        xformG.position.set(app.renderer.width * 0.5, app.renderer.height * 0.75);

        app.ticker.add(function () {
            xformR.rotation += 0.01;//  0.2*Math.PI;
            xformG.rotation -= 0.0025;//-0.1*Math.PI;  
            ripplesR.tileTransform = xformR;
            ripplesG.tileTransform = xformG;

            // ripplesR.tilePosition.x+=1.5;
            // ripplesG.tilePosition.y-=1.9;
            app.renderer.render(dContainer, dRenderTexture);
            phase += 0.005;
        });
    }

    applyOn(sprite) {
        const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        sprite.filters = [displacementFilter];
        displacementFilter.scale.x = 5;
        displacementFilter.scale.y = 5;
    }

    static createRipples(width, height, channel, freq) {
        const cvo = new PIXI.utils.CanvasRenderTarget(500, 500);
        const cv = cvo.canvas;
        const ctx = cvo.context;
        const grd = ctx.createLinearGradient(0, 0, 500, 0);
        const grd2 = ctx.createLinearGradient(0, 0, 0, 500);
        const col = channel ? 'red' : 'green';

        grd.addColorStop(0, 'black');
        grd.addColorStop(0.5, col);
        grd.addColorStop(1, 'black');
        grd2.addColorStop(0, 'black');
        grd2.addColorStop(0.5, 'rgba(0,0,0,0)');
        grd2.addColorStop(1, 'black');
        ctx.fillStyle = grd;
        ctx.save();
        ctx.scale(1 / freq, 1);
        for (var i = 0; i < freq; i++) {
            ctx.fillRect(0, 0, 500, 500);
            ctx.translate(500, 0);
        }
        ctx.restore();
        ctx.scale(1, 1 / freq);
        ctx.fillStyle = grd2;
        for (var i = 0; i < freq; i++) {
            ctx.fillRect(0, 0, 500, 500);
            ctx.translate(0, 500);
        }
        var ripples = new PIXI.TilingSprite(PIXI.Texture.from(cv), width, height);
        ripples.blendMode = PIXI.BLEND_MODES.ADD;
        return ripples;
    }
}

