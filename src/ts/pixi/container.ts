import * as PIXI from 'pixi.js';
import PositionResolver from './service/position-resolver';
import PositionSprite from './sprites/position-sprite';
import { UnitSprite } from './sprites/unit-sprite';

export default class BattlefieldContainer extends PIXI.Container {
    private positionResolver: PositionResolver;
    private positionsSprites: PositionSprite[];
    unitSprites: UnitSprite[];

    constructor(positionResolver: PositionResolver) {
        super();
        this.positionResolver = positionResolver;
        this.positionsSprites = [];
        this.unitSprites = [];
        // sort children by zIndex
        this.sortableChildren = true;
    }

    addUnit(unitSprite: UnitSprite) {
        this.addChild(unitSprite);
        this.unitSprites.push(unitSprite);
    }

    updateUnitPosition(sprite: PIXI.DisplayObject, i: number, j: number, k: number, inLiquid: boolean = false) {
        if (inLiquid) {
            k += 2 / 3;
        } else {
            k++;
        }
        this.positionResolver.update(sprite, i, j, k);
    }

    clearPositionTiles() {
        this.removeChild(...this.positionsSprites);
        this.positionsSprites = [];
    }

    addPositionTile(positionTile: PositionSprite, i: number, j: number, k: number) {
        this.addChild(positionTile);
        this.positionResolver.update(positionTile, i, j, k);
        this.positionsSprites.push(positionTile);
    }
}