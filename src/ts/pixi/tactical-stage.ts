import * as PIXI from 'pixi.js';
// trick to use pixi-layers
window.PIXI = PIXI;
import 'pixi-layers';
import FieldHolder from './field-holder';
import UnitsHolder from './units-holder';
import BattlefieldContainer from './battlefield-container';

export default class TacticalStage extends PIXI.display.Stage {
    statsLayer: PIXI.display.Layer;
    center: { x: number; y: number; };
    fieldHolder!: FieldHolder;
    unitsHolder!: UnitsHolder;
    battlefieldContainer!: BattlefieldContainer;
    blockSize: number;
    spatialStep: { x: number; y: number; z: number; };

    constructor(width: number, height: number) {
        super();

        this.statsLayer = new PIXI.display.Layer();
        this.center = { x: (width / 2), y: (height / 3) };
        this.interactive = true;
        this.blockSize = 64;
        this.spatialStep = {
            x: (this.blockSize - 2) / 2,
            y: (this.blockSize - 2) / 4,
            z: (-this.blockSize / 2)
        };
    }

}