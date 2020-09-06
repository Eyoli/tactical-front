import * as PIXI from 'pixi.js';
// trick to use pixi-layers
window.PIXI = PIXI;
import 'pixi-layers';

export default class TacticalStage extends PIXI.display.Stage {
    statsLayer: PIXI.display.Layer;
    center: { x: number; y: number; };

    constructor(width: number, height: number) {
        super();
        this.statsLayer = new PIXI.display.Layer();
        this.center = { x: (width / 2), y: (height / 3) };
    }

}