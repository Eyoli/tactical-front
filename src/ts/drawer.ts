import * as PIXI from 'pixi.js';
import BattlefieldContainer from './container';
import path from 'path';
import { PositionResolver, WaterEffect, UnitSprite, TileSprite, PositionSprite } from './sprites';

const TILES_TEXTURES_REPOSITORY = "./assets/tiles";
const UNITS_TEXTURES_REPOSITORY = "./assets/units";
const BLOCK_SIZE = 64;
const SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };
const ResourceLoader = PIXI.Loader.shared;

export default class Drawer {
    private app: PIXI.Application;
    private resourcesMap: Map<any, any>;
    private unitsHolder: Map<any, any>;
    private battlefieldContainer: BattlefieldContainer;
    private waterEffectService: any;
    private tiles!: any[][][];
    private tilesSprites: any;

    constructor(application: PIXI.Application) {
        this.app = application;
        this.resourcesMap = new Map();
        this.unitsHolder = new Map();
        this.battlefieldContainer = new BattlefieldContainer(new PositionResolver(SPATIAL_STEP));
        this.waterEffectService = new WaterEffect(this.app);

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

    drawUnits(unitStates: any, onClickOnUnit: Function) {
        const fluffyTextures: PIXI.Texture[] = [];
        for (let i = 0; i < 8; i++) {
            const fluffyTexture = PIXI.Texture.from("fluffy-red-" + i + ".png");
            fluffyTextures.push(fluffyTexture);
        }
        fluffyTextures.push(PIXI.Texture.from("fluffy-red-0.png"));

        unitStates.forEach((unitState: any) => {
            const { position: { x, y, z } } = unitState;
            const unitSprite = new UnitSprite(fluffyTextures, BLOCK_SIZE);
            unitSprite.onClick(() => onClickOnUnit(unitState));
            this.battlefieldContainer.addUnit(unitSprite);
            this.updateUnitPosition(unitSprite, x, y, z);
            this.unitsHolder.set(unitState.unit.id, unitSprite);
        });
        this.battlefieldContainer.sortByZIndex();
    }

    drawPositions(positions: any[], onClickOnPosition: Function) {
        this.battlefieldContainer.clearPositionTiles();
        positions.forEach(p => {
            const positionTile = new PositionSprite(this.tilesSprites[p.x][p.y][p.z]);
            positionTile.on('pointerdown', () => onClickOnPosition(p));
            this.battlefieldContainer.addPositionTile(positionTile, p.x, p.y, p.z);
        });
        this.battlefieldContainer.sortByZIndex();
    }

    clearPositionTiles() {
        this.battlefieldContainer.clearPositionTiles();
    }

    updateUnit(unitState: any, onClickOnUnit: Function) {
        const unitSprite = this.unitsHolder.get(unitState.unit.id);
        unitSprite.onClick(() => onClickOnUnit(unitState));
        this.updateUnitPosition(
            unitSprite,
            unitState.position.x,
            unitState.position.y,
            unitState.position.z
        );
        this.battlefieldContainer.sortByZIndex();
    }

    updateUnitPosition(unitSprite: any, x: number, y: number, z: number) {
        const tileType = this.resourcesMap.get(this.tiles[x][y][z]);
        if (tileType.liquid) {
            z += 2 / 3;
        } else {
            z += 1;
        }
        this.battlefieldContainer.updatePosition(unitSprite, x, y, z);
    }
}