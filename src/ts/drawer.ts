import * as PIXI from 'pixi.js';
import BattlefieldContainer from './container';
import path from 'path';
import { UnitSprite, Fluffy } from './sprites/unit-sprite';
import WaterEffectService from './service/water-effect-service';
import PositionResolver from './service/position-resolver';
import TileSprite from './sprites/tile-sprite';
import PositionSprite from './sprites/position-sprite';
import { EventManager, TacticalEvent } from './event-manager';

const TILES_TEXTURES_REPOSITORY = "./assets/tiles";
const UNITS_TEXTURES_REPOSITORY = "./assets/units";
const BLOCK_SIZE = 64;
const SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };
const ResourceLoader = PIXI.Loader.shared;

const MOVE_TILE_COLOR = 0x3500FA;
const ACT_TILE_COLOR = 0x832A2A;

export default class Drawer {
    private app: PIXI.Application;
    private eventManager: EventManager;
    private resourcesMap: Map<any, any>;
    private unitsHolder: Map<string, UnitSprite>;
    private battlefieldContainer: BattlefieldContainer;
    private waterEffectService: any;
    private tiles!: any[][][];
    private tilesSprites: any;

    constructor(application: PIXI.Application, eventManager: EventManager) {
        this.eventManager = eventManager;

        this.app = application;
        this.resourcesMap = new Map();
        this.unitsHolder = new Map();
        this.battlefieldContainer = new BattlefieldContainer(new PositionResolver(SPATIAL_STEP));
        this.waterEffectService = new WaterEffectService(this.app);

        const P0 = { x: (this.app.renderer.screen.width / 2), y: (this.app.renderer.screen.height / 2) };
        this.battlefieldContainer.position.set(P0.x, P0.y);
        this.app.stage.addChild(this.battlefieldContainer);

        ResourceLoader.add("fluffy", path.join(UNITS_TEXTURES_REPOSITORY, "fluffy-red-opt.json"));
    }

    load(tileTypes: any[], callback: any) {
        tileTypes.forEach(tileType => {
            tileType.src = path.join(TILES_TEXTURES_REPOSITORY, tileType.src);
            ResourceLoader.add(tileType.src);
            this.resourcesMap.set(tileType.type, tileType);
        });
        ResourceLoader.load(callback);
    }

    drawBattlefield(battlefield: any) {
        this.tiles = battlefield.tiles;
        this.tilesSprites = this.tiles.map(
            (row, i) => row.map(
                (pile, j) => pile.map(
                    (tile, k) => {
                        const tileType = this.resourcesMap.get(tile);
                        const tileSprite = new TileSprite(ResourceLoader.resources[tileType.src].texture, BLOCK_SIZE);
                        this.battlefieldContainer.addTile(tileSprite, i, j, k);

                        if (tileType.liquid) {
                            this.waterEffectService.applyOn(tileSprite);
                        }
                        return tileSprite;
                    }
                )
            )
        );
    }

    drawUnits(unitStates: any) {
        unitStates.forEach((unitState: any) => {
            const { position: { x, y, z } } = unitState;
            const unitSprite = new Fluffy(BLOCK_SIZE);
            this.battlefieldContainer.addUnit(unitSprite);
            this.unitsHolder.set(unitState.unit.id, unitSprite);
            this.updateUnit(unitState);
        });
        this.battlefieldContainer.sortByZIndex();
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
            const sprite = this.tilesSprites[p.x][p.y][p.z];
            const positionTile = new PositionSprite(sprite.width, sprite.height, color);
            this.battlefieldContainer.addPositionTile(positionTile, p.x, p.y, p.z);
            positionTile.onClick(() => this.eventManager.dispatchEvent(TacticalEvent.EVENT_CLICK_ON_POSITION, p));
        });
        this.battlefieldContainer.sortByZIndex();
    }

    clearPositionTiles() {
        this.battlefieldContainer.clearPositionTiles();
    }

    disableClickOnUnits() {
        this.battlefieldContainer.unitSprites.forEach(unitSprite => unitSprite.disable());
    }

    enableClickOnUnits() {
        this.battlefieldContainer.unitSprites.forEach(unitSprite => unitSprite.enable());
    }

    updateUnits(unitStates: any[]) {
        unitStates.forEach(unitState => this.updateUnit(unitState));
    }

    updateUnit(unitState: any) {
        const unitSprite = this.unitsHolder.get(unitState.unit.id)!;
        const p = unitState.position;
        unitSprite.onClick(() => this.eventManager.dispatchEvent(TacticalEvent.EVENT_CLICK_ON_UNIT, unitState));

        const tileType = this.resourcesMap.get(this.tiles[p.x][p.y][p.z]);
        let z: number = p.z;
        if (tileType.liquid) {
            z += 2 / 3;
        } else {
            z += 1;
        }

        this.battlefieldContainer.updatePosition(unitSprite, p.x, p.y, z);
        this.battlefieldContainer.sortByZIndex();
    }
}