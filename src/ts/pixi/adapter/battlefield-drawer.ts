import * as PIXI from 'pixi.js';
import UnitsHolder from '../units-holder';
import WaterEffectService from '../service/water-effect-service';
import PositionResolver from '../service/position-resolver';
import Damage from '../sprites/damage';
import EventManager from '../../game/service/event-manager';
import BattlefieldDrawerPort from '../../game/port/battlefield-drawer-port';
import { Events } from '../../game/enums';
import FieldHolder from '../field-holder';
import ResourcesManager from '../service/resources-manager';
import TacticalStage from '../tactical-stage';
import BattlefieldContainer from '../battlefield-container';
import { UnitContainer } from '../sprites/unit-container';
import { UnitState } from '../../game/types';
import { Position } from '../../../server/request-handler-port';

const MOVE_TILE_COLOR = 0x3500FA;
const ACT_TILE_COLOR = 0x832A2A;

export default class BattlefieldDrawer implements BattlefieldDrawerPort {
    private stage: TacticalStage;
    private eventManager: EventManager;
    private waterEffectService: WaterEffectService;

    private resourcesManager: ResourcesManager;
    private damageText!: Damage;
    private positionResolver: PositionResolver;

    constructor(stage: TacticalStage, eventManager: EventManager, waterEffectService: WaterEffectService) {
        this.stage = stage;
        this.eventManager = eventManager;
        this.waterEffectService = waterEffectService;
        this.positionResolver = new PositionResolver(this.stage.spatialStep);
        this.resourcesManager = new ResourcesManager();
    }

    startNewBattle(field: any, unitStates: UnitState[]) {
        this.stage.unitsHolder = new UnitsHolder(
            this.stage.blockSize, this.resourcesManager, this.positionResolver);

        this.stage.fieldHolder = new FieldHolder(this.stage.blockSize,
            this.waterEffectService,
            this.positionResolver,
            this.resourcesManager);

        this.stage.battlefieldContainer = new BattlefieldContainer();
        this.stage.battlefieldContainer.removeChildren();
        this.stage.battlefieldContainer.position.set(this.stage.center.x, this.stage.center.y);

        // Handle zoom on mousewheel event
        this.stage.on('mousewheel', (ev: any) => {
            this.eventManager.dispatch(Events.CLICK_ON_CLOSE_MENU);
            if (ev.wheelDelta > 0) {
                this.stage.battlefieldContainer.scale.set(
                    Math.min(2, this.stage.battlefieldContainer.scale.x + 0.1),
                    Math.min(2, this.stage.battlefieldContainer.scale.y + 0.1)
                );
            } else {
                this.stage.battlefieldContainer.scale.set(
                    Math.max(0.5, this.stage.battlefieldContainer.scale.x - 0.1),
                    Math.max(0.5, this.stage.battlefieldContainer.scale.y - 0.1)
                );
            }
        });

        this.stage.on("rightclick", () => this.eventManager.dispatch(Events.CLICK_ON_CLOSE_MENU));

        this.damageText = new Damage();
        this.stage.battlefieldContainer.addChild(this.damageText);
        this.damageText.parentLayer = this.stage.statsLayer;
        this.stage.addChild(
            this.stage.battlefieldContainer,
            this.stage.statsLayer);

        this.stage.fieldHolder.loadTileTypes(field.tileTypes);
        this.resourcesManager.loadThen(() => {
            this.drawField(field);
            if (unitStates) {
                this.drawUnits(unitStates);
            }
        });
    }

    private drawField(field: any) {
        this.stage.fieldHolder.parseField(field, this.stage.battlefieldContainer);
    }

    private drawUnits(unitStates: UnitState[]) {
        unitStates.forEach((unitState: any) => {
            const unitSprite = this.stage.unitsHolder.addUnit(unitState, this.stage.battlefieldContainer);
            unitSprite.lifeBar.parentLayer = this.stage.statsLayer;
            this.updateUnit(unitState);
        });
    }

    drawPositionsForMove(positions: Position[]) {
        this.drawPositions(positions, MOVE_TILE_COLOR);
    }

    drawPositionsForAction(positions: Position[]) {
        this.drawPositions(positions, ACT_TILE_COLOR);
    }

    private drawPositions(positions: Position[], color: number) {
        this.stage.fieldHolder.clearPositionTiles(this.stage.battlefieldContainer);
        positions.forEach(p => {
            const positionTile = this.stage.fieldHolder.addPositionTile(color, p, this.stage.battlefieldContainer);
            positionTile.onClick(() => this.eventManager.dispatch(Events.CLICK_ON_POSITION, p));
        });
    }

    clearPositionTiles() {
        this.stage.fieldHolder.clearPositionTiles(this.stage.battlefieldContainer);
    }

    updateUnits(unitStates: UnitState[]) {
        unitStates.forEach(unitState => this.updateUnit(unitState));
    }

    updateUnit(unitState: UnitState) {
        const p = unitState.position;
        const isLiquid = this.stage.fieldHolder.isLiquid(p);
        const unitContainer = this.stage.unitsHolder.updateUnit(unitState, p, isLiquid);
        unitContainer.idle(unitState.direction);
        unitContainer.removeListener("pointerdown");
        unitContainer.on('pointerdown',
            () => this.eventManager.dispatch(Events.CLICK_ON_UNIT, unitState));
    }

    moveUnit(unitState: UnitState): void {
        const unitContainer = this.stage.unitsHolder.getUnit(unitState.unit.id);
        unitContainer.removeListener("pointerdown");
        this.stage.unitsHolder.moveUnit(unitState, (unitContainer: UnitContainer) => {
            unitContainer.on('pointerdown',
                () => this.eventManager.dispatch(Events.CLICK_ON_UNIT, unitState));
        });
    }

    drawDamage(unitState: UnitState, damage: number) {
        const unitSprite = this.stage.unitsHolder.getUnit(unitState.unit.id)!;
        this.damageText.display(damage, unitSprite.x, unitSprite.y);
    }

    activateAreaDrawing(actionType: any): void {
    }
}