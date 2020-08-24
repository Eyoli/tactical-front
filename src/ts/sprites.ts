import * as PIXI from 'pixi.js';

function prepareNextAnimation(unitSprite: PIXI.AnimatedSprite) {
    unitSprite.gotoAndPlay(0);
    setTimeout(() => prepareNextAnimation(unitSprite), 3000 + Math.random() * 2000);
}

export class UnitSprite extends PIXI.AnimatedSprite {

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

        prepareNextAnimation(this);
    }

    onClick(callback: Function) {
        this.on('pointerdown', callback);
    }
}

export class TileSprite extends PIXI.Sprite {
    private size: number;

    constructor(texture: PIXI.Texture, size: number) {
        super(texture);

        this.width = size;
        this.height = size;
        this.pivot.set(this.width / 2, this.height);
        this.size = size;
    }
}

export class PositionSprite extends PIXI.Graphics {

    constructor(tileSprite: PIXI.Sprite) {
        super();

        this.lineStyle(0);
        this.beginFill(0x3500FA, 0.5);
        this.drawPolygon([
            0, tileSprite.height / 4,
            tileSprite.width / 2, 0,
            tileSprite.width, tileSprite.height / 4,
            tileSprite.width / 2, tileSprite.height / 2,
        ]);
        this.endFill();
        this.pivot.set(this.width / 2, 2 * this.height);
        this.zIndex = this.zIndex;

        // interactivity
        this.interactive = true;
        this.buttonMode = true;
    }
}

type SpatialStep = {x: number, y: number, z: number};
export class PositionResolver {
    private spatialStep: SpatialStep;

    constructor(spatialStep: SpatialStep) {
        this.spatialStep = spatialStep;
    }

    resolve(i: number, j: number, k: number) {
        return {
            x: (j - i) * this.spatialStep.x,
            y: (j + i) * this.spatialStep.y + k * this.spatialStep.z
        };
    }
}

export class WaterEffect {
    private displacementSprite: PIXI.Sprite;

    constructor(app: PIXI.Application) {
        const dContainer = new PIXI.Container();
        const dRenderTexture = PIXI.RenderTexture.create({
            width: app.renderer.width, 
            height: app.renderer.height});
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

    applyOn(sprite: PIXI.Sprite) {
        const displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        sprite.filters = [displacementFilter];
        displacementFilter.scale.x = 7;
        displacementFilter.scale.y = 7;
    }

    static createRipples(width: number, height: number, channel: number, freq: number) {
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

