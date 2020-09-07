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

const MOVE_TILE_COLOR = 0x3500FA;
const ACT_TILE_COLOR = 0x832A2A;

export default class BattlefieldDrawer implements BattlefieldDrawerPort {
    private stage: TacticalStage;
    private eventManager: EventManager;
    private waterEffectService: WaterEffectService;

    private resourcesManager: ResourcesManager;
    private damageText!: Damage;

    constructor(stage: TacticalStage, eventManager: EventManager, waterEffectService: WaterEffectService) {
        this.stage = stage;
        this.eventManager = eventManager;
        this.waterEffectService = waterEffectService;
        this.resourcesManager = new ResourcesManager();
    }

    startNewBattle(field: any, unitStates: any) {
        this.stage.unitsHolder = new UnitsHolder(
            this.stage.blockSize, this.resourcesManager, new PositionResolver(this.stage.spatialStep));

        this.stage.fieldHolder = new FieldHolder(this.stage.blockSize,
            this.waterEffectService,
            new PositionResolver(this.stage.spatialStep),
            this.resourcesManager);

        this.stage.battlefieldContainer = new BattlefieldContainer();

        this.stage.battlefieldContainer.removeChildren();
        this.stage.battlefieldContainer.position.set(this.stage.center.x, this.stage.center.y);

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

    private drawField(battlefield: any) {
        this.stage.fieldHolder.addTiles(battlefield.tiles, this.stage.battlefieldContainer);
    }

    private drawUnits(unitStates: any) {
        unitStates.forEach((unitState: any) => {
            const unitSprite = this.stage.unitsHolder.addUnit(unitState, this.stage.battlefieldContainer);
            unitSprite.lifeBar.parentLayer = this.stage.statsLayer;
            this.updateUnit(unitState);
        });
    }

    drawPositionsForMove(positions: any[]) {
        this.drawPositions(positions, MOVE_TILE_COLOR);
    }

    drawPositionsForAction(positions: any[]) {
        this.drawPositions(positions, ACT_TILE_COLOR);
    }

    private drawPositions(positions: any[], color: number) {
        this.stage.fieldHolder.clearPositionTiles(this.stage.battlefieldContainer);
        positions.forEach(p => {
            const positionTile = this.stage.fieldHolder.addPositionTile(color, p, this.stage.battlefieldContainer);
            positionTile.onClick(() => this.eventManager.dispatch(Events.CLICK_ON_POSITION, p));
        });
    }

    clearPositionTiles() {
        this.stage.fieldHolder.clearPositionTiles(this.stage.battlefieldContainer);
    }

    updateUnits(unitStates: any[]) {
        unitStates.forEach(unitState => this.updateUnit(unitState));
    }

    updateUnit(unitState: any) {
        const p = unitState.position;
        const isLiquid = this.stage.fieldHolder.isLiquid(p);
        const unitSprite = this.stage.unitsHolder.updateUnit(unitState, p, isLiquid);
        unitSprite.removeListener("pointerdown");
        unitSprite.on('pointerdown',
            () => this.eventManager.dispatch(Events.CLICK_ON_UNIT, unitState));
    }

    drawDamage(unitState: any, damage: number) {
        const unitSprite = this.stage.unitsHolder.getUnit(unitState.unit.id)!;
        this.damageText.display(damage, unitSprite.x, unitSprite.y);
    }

    activateAreaDrawing(actionType: any): void {
    }
}