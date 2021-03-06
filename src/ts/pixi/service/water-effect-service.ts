import * as PIXI from 'pixi.js';

export default class WaterEffectService {
    private displacementSprite: PIXI.Sprite;
    displacementFilter: PIXI.filters.DisplacementFilter;
    alphaFilter: PIXI.filters.AlphaFilter;

    constructor(app: PIXI.Application) {
        const dContainer = new PIXI.Container();
        const dRenderTexture = PIXI.RenderTexture.create({
            width: app.renderer.width,
            height: app.renderer.height
        });
        const ripplesR = WaterEffectService.createRipples(app.renderer.width, app.renderer.height, 0, 6);
        const ripplesG = WaterEffectService.createRipples(app.renderer.width, app.renderer.height, 1, 7);
        this.displacementSprite = new PIXI.Sprite(dRenderTexture);

        dContainer.addChild(ripplesR);
        dContainer.addChild(ripplesG);

        const blurFilter = new PIXI.filters.BlurFilter(15, 3, 1);
        dContainer.filters = [blurFilter];

        const xformR = new PIXI.Transform();
        const xformG = new PIXI.Transform();
        // let phase = 0;
        xformR.position.set(app.renderer.width * 0.5, app.renderer.height * 0.25);
        xformG.position.set(app.renderer.width * 0.5, app.renderer.height * 0.75);

        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        this.displacementFilter.scale.x = 6;
        this.displacementFilter.scale.y = 6;

        this.alphaFilter = new PIXI.filters.AlphaFilter(0.5);

        app.ticker.add(function () {
            xformR.rotation += 0.01;//  0.2*Math.PI;
            xformG.rotation -= 0.0025;//-0.1*Math.PI;  
            ripplesR.tileTransform = xformR;
            ripplesG.tileTransform = xformG;

            app.renderer.render(dContainer, dRenderTexture);
            // phase += 0.005;
        });
    }

    applyOn(displayObject: PIXI.DisplayObject, waterfall = false): void {
        displayObject.filters = [this.displacementFilter, this.alphaFilter];
    }

    static createRipples(width: number, height: number, channel: number, freq: number): PIXI.TilingSprite {
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
        for (let i = 0; i < freq; i++) {
            ctx.fillRect(0, 0, 500, 500);
            ctx.translate(500, 0);
        }
        ctx.restore();
        ctx.scale(1, 1 / freq);
        ctx.fillStyle = grd2;
        for (let i = 0; i < freq; i++) {
            ctx.fillRect(0, 0, 500, 500);
            ctx.translate(0, 500);
        }
        const ripples = new PIXI.TilingSprite(PIXI.Texture.from(cv), width, height);
        ripples.blendMode = PIXI.BLEND_MODES.ADD;
        return ripples;
    }
}