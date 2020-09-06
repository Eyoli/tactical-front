import * as PIXI from 'pixi.js';
import PositionResolver from './service/position-resolver';
import PositionSprite from './sprites/position-sprite';
import UnitContainer from './sprites/unit-container';
import { Position } from '../../server/request-handler-port';
import Fluffy from './sprites/fluffy';
import ResourcesManager from './service/resources-manager';
import { Direction } from '../game/enums';
import { CrusaderDown, CrusaderRight, CrusaderUp, CrusaderLeft } from './sprites/crusader';

export default class UnitsHolder {
    private positionResolver: PositionResolver;
    private blockSize: number;
    private unitSprites: Map<string, UnitContainer>;
    private resourcesManager: ResourcesManager;

    constructor(blockSize: number, resourcesManager: ResourcesManager, positionResolver: PositionResolver) {
        this.positionResolver = positionResolver;
        this.resourcesManager = resourcesManager;
        this.blockSize = blockSize;
        this.unitSprites = new Map();
    }

    addUnit(unitState: any, container: PIXI.Container) {
        const unitSprite = new UnitContainer(this.blockSize)
            .withOutline()
            .withFace(Direction.LEFT, new CrusaderLeft(this.blockSize, this.resourcesManager))
            .withFace(Direction.UP, new CrusaderUp(this.blockSize, this.resourcesManager))
            .withFace(Direction.RIGHT, new CrusaderRight(this.blockSize, this.resourcesManager))
            .withFace(Direction.DOWN, new CrusaderDown(this.blockSize, this.resourcesManager))
        unitSprite.face(Direction.DOWN);
        this.unitSprites.set(unitState.unit.id, unitSprite);
        container.addChild(unitSprite);
        return unitSprite;
    }

    updateUnit(unitState: any, p: Position, inLiquid: boolean = false) {
        const unitSprite = this.unitSprites.get(unitState.unit.id)!;
        unitSprite.face(unitState.direction);
        unitSprite.lifeBar.update(unitState.health.current / unitState.unit.statistics.health);

        if (!inLiquid) {
            p.z++;
        } else {
        }
        this.positionResolver.update(unitSprite, p);
        return unitSprite;
    }

    getUnit(unitId: string) {
        return this.unitSprites.get(unitId)!;
    }
}