import * as PIXI from 'pixi.js';
import PositionResolver from './service/position-resolver';
import PositionSprite from './sprites/position-sprite';
import { UnitSprite, Fluffy } from './sprites/unit-sprite';
import { Position } from '../../server/request-handler-port';

export default class UnitsHolder {
    private positionResolver: PositionResolver;
    private blockSize: number;
    private unitSprites: Map<string, UnitSprite>;

    constructor(blockSize: number, positionResolver: PositionResolver) {
        this.positionResolver = positionResolver;
        this.blockSize = blockSize;
        this.unitSprites = new Map();
    }

    addUnit(unitState: any, container: PIXI.Container) {
        const unitSprite = new Fluffy(this.blockSize).withOutline();
        this.unitSprites.set(unitState.unit.id, unitSprite);
        container.addChild(unitSprite);
        return unitSprite;
    }

    updateUnit(unitState: any, p: Position, inLiquid: boolean = false) {
        const unitSprite = this.unitSprites.get(unitState.unit.id)!;
        unitSprite.lifeBar.update(unitState.health.current / unitState.unit.statistics.health);
        
        if (!inLiquid) {
            p.z++;
        } else {
            p.z += 1/3;
        }
        this.positionResolver.update(unitSprite, p);
        return unitSprite;
    }

    getUnit(unitId: string) {
        return this.unitSprites.get(unitId)!;
    }
}