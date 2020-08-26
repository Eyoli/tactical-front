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
    }

    addTile(tileSprite: PIXI.Sprite, i: number, j: number, k: number) {
        this.addChild(tileSprite);
        this.updatePosition(tileSprite, i, j, k);
    }

    addUnit(unitSprite: UnitSprite) {
        this.addChild(unitSprite);
        this.unitSprites.push(unitSprite);
    }

    updatePosition(sprite: PIXI.DisplayObject, i: number, j: number, k: number) {
        const { x: xReal, y: yReal } = this.positionResolver.resolve(i, j, k);
        sprite.position.set(xReal, yReal);
        sprite.zIndex = i + j + k;
    }

    clearPositionTiles() {
        this.removeChild(...this.positionsSprites);
        this.positionsSprites = [];
    }

    addPositionTile(positionTile: PositionSprite, i: number, j: number, k: number) {
        this.addChild(positionTile);
        this.updatePosition(positionTile, i, j, k);
        this.positionsSprites.push(positionTile);
    }

    sortByZIndex() {
        this.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }
}