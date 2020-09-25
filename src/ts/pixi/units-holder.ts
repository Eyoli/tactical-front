import * as PIXI from 'pixi.js';
import PositionResolver from './service/position-resolver';
import { UnitContainer } from './sprites/unit-container';
import { Position } from '../../server/request-handler-port';
import ResourcesManager from './service/resources-manager';
import { Direction } from '../game/enums';
import Crusader from './sprites/crusader';
import { UnitState } from '../game/types';
import MoveAnimation from './animation/move-animation';

export default class UnitsHolder {
    private readonly positionResolver: PositionResolver;
    private readonly blockSize: number;
    private readonly unitContainers: Map<string, UnitContainer>;
    private readonly resourcesManager: ResourcesManager;

    constructor(blockSize: number, resourcesManager: ResourcesManager, positionResolver: PositionResolver) {
        this.positionResolver = positionResolver;
        this.resourcesManager = resourcesManager;
        this.blockSize = blockSize;
        this.unitContainers = new Map();
    }

    addUnit(unitState: UnitState, container: PIXI.Container): UnitContainer {
        const unitContainer = new Crusader(this.blockSize, this.resourcesManager).withOutline();

        unitContainer.idle(Direction.DOWN);
        this.unitContainers.set(unitState.unit.id, unitContainer);
        container.addChild(unitContainer);
        return unitContainer;
    }

    updateUnit(unitState: UnitState, p: Position, inLiquid = false): UnitContainer {
        const unitContainer = this.getUnit(unitState.unit.id);
        unitContainer.lifeBar.update(unitState.health.current / unitState.unit.statistics.health);

        const actualPosition: Position = { x: p.x, y: p.y, z: p.z };
        if (!inLiquid) {
            actualPosition.z++;
        }
        this.positionResolver.update(unitContainer, actualPosition);
        return unitContainer;
    }

    moveUnit(unitState: UnitState, onComplete: (unitContainer: UnitContainer) => void): void {
        const unitContainer = this.getUnit(unitState.unit.id);
        const moveAnimation = new MoveAnimation(unitContainer, unitState.path);
        moveAnimation.onUpdate((p: Position) => {
            this.updateUnit(unitState, p);
        });
        moveAnimation.onComplete(onComplete);
        moveAnimation.start();
    }

    getUnit(unitId: string): UnitContainer {
        const unitContainer = this.unitContainers.get(unitId);
        if (!unitContainer) {
            throw new Error("No sprite for this unit");
        }
        return unitContainer;
    }
}