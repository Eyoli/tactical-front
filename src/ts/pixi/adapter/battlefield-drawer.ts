import * as PIXI from 'pixi.js';
import BattlefieldContainer from '../container';
import path from 'path';
import { UnitSprite, Fluffy } from '../sprites/unit-sprite';
import WaterEffectService from '../service/water-effect-service';
import PositionResolver from '../service/position-resolver';
import TileSprite from '../sprites/tile-sprite';
import PositionSprite from '../sprites/position-sprite';
import Damage from '../sprites/damage';
import EventManager from '../../game/service/event-manager';
import BattlefieldDrawerPort from '../../game/port/battlefield-drawer-port';
import { Events } from '../../game/enums';
import FieldHolder from '../field-holder';
import ResourcesManager from '../service/resources-manager';

const BLOCK_SIZE = 64;
const SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };

const MOVE_TILE_COLOR = 0x3500FA;
const ACT_TILE_COLOR = 0x832A2A;

export default class BattlefieldDrawer implements BattlefieldDrawerPort {
    private app: PIXI.Application;
    private eventManager: EventManager;

    private resourcesManager: ResourcesManager;
    private unitsHolder: Map<string, UnitSprite>;
    private battlefieldContainer!: BattlefieldContainer;
    private fieldHolder!: FieldHolder;
    private statsLayer!: PIXI.display.Layer;
    private damageText!: Damage;

    constructor(app: PIXI.Application, eventManager: EventManager) {
        this.eventManager = eventManager;
        this.app = app;
        this.app.stage = new PIXI.display.Stage();
        this.resourcesManager = new ResourcesManager();
        this.unitsHolder = new Map();
    }

    startNewBattle(field: any, unitStates: any) {
        this.battlefieldContainer = new BattlefieldContainer(new PositionResolver(SPATIAL_STEP));
        const P0 = { x: (this.app.renderer.screen.width / 2), y: (this.app.renderer.screen.height / 3) };
        this.battlefieldContainer.position.set(P0.x, P0.y);

        this.unitsHolder.clear();

        this.fieldHolder = new FieldHolder(BLOCK_SIZE,
            new WaterEffectService(this.app),
            new PositionResolver(SPATIAL_STEP),
            this.resourcesManager);
        this.statsLayer = new PIXI.display.Layer();

        this.damageText = new Damage();
        this.battlefieldContainer.addChild(this.damageText);
        this.damageText.parentLayer = this.statsLayer;
        this.app.stage.addChild(
            this.battlefieldContainer, 
            this.statsLayer);

        this.fieldHolder.loadTileTypes(field.tileTypes);
        this.resourcesManager.loadThen(() => {
            this.drawField(field);
            if (unitStates) {
                this.drawUnits(unitStates);
            }
        });
    }

    drawField(battlefield: any) {
        this.fieldHolder.addTiles(battlefield.tiles, this.battlefieldContainer);
    }

    drawUnits(unitStates: any) {
        unitStates.forEach((unitState: any) => {
            const unitSprite = new Fluffy(BLOCK_SIZE);
            this.battlefieldContainer.addUnit(unitSprite.withOutline());
            unitSprite.lifeBar.parentLayer = this.statsLayer;
            this.unitsHolder.set(unitState.unit.id, unitSprite);
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
        this.battlefieldContainer.clearPositionTiles();
        positions.forEach(p => {
            const sprite = this.fieldHolder.getTile(p.x, p.y, p.z);
            const positionTile = new PositionSprite(sprite.width, sprite.height, color);
            this.battlefieldContainer.addPositionTile(positionTile, p.x, p.y, p.z);
            positionTile.onClick(() => this.eventManager.dispatch(Events.CLICK_ON_POSITION, p));
        });
    }

    clearPositionTiles() {
        this.battlefieldContainer.clearPositionTiles();
    }

    updateUnits(unitStates: any[]) {
        unitStates.forEach(unitState => this.updateUnit(unitState));
    }

    updateUnit(unitState: any) {
        const unitSprite = this.unitsHolder.get(unitState.unit.id)!;
        unitSprite.lifeBar.update(unitState.health.current / unitState.unit.statistics.health);
        const p = unitState.position;
        unitSprite.removeListener("pointerdown");
        unitSprite.onClick(() => this.eventManager.dispatch(Events.CLICK_ON_UNIT, unitState));

        const isLiquid = this.fieldHolder.isLiquid(p.x, p.y, p.z);
        this.battlefieldContainer.updateUnitPosition(unitSprite, p.x, p.y, p.z, isLiquid);
    }

    drawDamage(unitState: any, damage: number) {
        const unitSprite = this.unitsHolder.get(unitState.unit.id)!;
        this.damageText.display(damage, unitSprite.x, unitSprite.y);
    }
}