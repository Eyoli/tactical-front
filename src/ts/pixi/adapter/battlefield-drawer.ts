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
import logger from '../../game/service/logger';

const BLOCK_SIZE = 64;
const SPATIAL_STEP = {
    x: (BLOCK_SIZE - 2) / 2,
    y: (BLOCK_SIZE - 2) / 4,
    z: (-BLOCK_SIZE / 2)
};

const MOVE_TILE_COLOR = 0x3500FA;
const ACT_TILE_COLOR = 0x832A2A;

class BattlefieldContainer extends PIXI.Container {

    constructor() {
        super();
        // sort children by zIndex
        this.sortableChildren = true;

        // Handle zoom on mousewheel event
        this.interactive = true;
        this.on('mousewheel', (ev: any) => {
            if (ev.wheelDelta > 0) {
                this.scale.set(
                    Math.min(2, this.scale.x + 0.1),
                    Math.min(2, this.scale.y + 0.1)
                );
            } else {
                this.scale.set(
                    Math.max(0.5, this.scale.x - 0.1),
                    Math.max(0.5, this.scale.y - 0.1)
                );
            }
        });
    }
}

export default class BattlefieldDrawer implements BattlefieldDrawerPort {
    private app: PIXI.Application;
    private eventManager: EventManager;

    private resourcesManager: ResourcesManager;
    private battlefieldContainer!: BattlefieldContainer;
    private fieldHolder!: FieldHolder;
    private unitsHolder!: UnitsHolder;
    private statsLayer!: PIXI.display.Layer;
    private damageText!: Damage;

    constructor(app: PIXI.Application, eventManager: EventManager) {
        this.eventManager = eventManager;
        this.app = app;
        this.app.stage = new PIXI.display.Stage();
        this.resourcesManager = new ResourcesManager();

    }

    startNewBattle(field: any, unitStates: any) {
        this.unitsHolder = new UnitsHolder(BLOCK_SIZE, new PositionResolver(SPATIAL_STEP));

        this.fieldHolder = new FieldHolder(BLOCK_SIZE,
            new WaterEffectService(this.app),
            new PositionResolver(SPATIAL_STEP),
            this.resourcesManager);

        this.battlefieldContainer = new BattlefieldContainer();
        this.statsLayer = new PIXI.display.Layer();

        this.battlefieldContainer.removeChildren();
        const P0 = { x: (this.app.renderer.screen.width / 2), y: (this.app.renderer.screen.height / 3) };
        this.battlefieldContainer.position.set(P0.x, P0.y);

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

    private drawField(battlefield: any) {
        this.fieldHolder.addTiles(battlefield.tiles, this.battlefieldContainer);
    }

    private drawUnits(unitStates: any) {
        unitStates.forEach((unitState: any) => {
            const unitSprite = this.unitsHolder.addUnit(unitState, this.battlefieldContainer);
            unitSprite.lifeBar.parentLayer = this.statsLayer;
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
        this.fieldHolder.clearPositionTiles(this.battlefieldContainer);
        positions.forEach(p => {
            const positionTile = this.fieldHolder.addPositionTile(color, p, this.battlefieldContainer);
            positionTile.onClick(() => this.eventManager.dispatch(Events.CLICK_ON_POSITION, p));
        });
    }

    clearPositionTiles() {
        this.fieldHolder.clearPositionTiles(this.battlefieldContainer);
    }

    updateUnits(unitStates: any[]) {
        unitStates.forEach(unitState => this.updateUnit(unitState));
    }

    updateUnit(unitState: any) {
        const p = unitState.position;
        const isLiquid = this.fieldHolder.isLiquid(p);
        const unitSprite = this.unitsHolder.updateUnit(unitState, p, isLiquid);
        unitSprite.removeListener("pointerdown");
        unitSprite.onClick(() => this.eventManager.dispatch(Events.CLICK_ON_UNIT, unitState));
    }

    drawDamage(unitState: any, damage: number) {
        const unitSprite = this.unitsHolder.getUnit(unitState.unit.id)!;
        this.damageText.display(damage, unitSprite.x, unitSprite.y);
    }

    activateAreaDrawing(actionType: any): void {
    }
}