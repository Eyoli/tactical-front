import WaterEffectService from "./service/water-effect-service";
import TileSprite from "./sprites/tile-sprite";
import * as PIXI from "pixi.js";
import PositionResolver from "./service/position-resolver";
import path from 'path';
import ResourcesManager from "./service/resources-manager";

export default class FieldHolder {
    private waterEffectService: WaterEffectService;
    private positionResolver: PositionResolver;
    resourcesManager: ResourcesManager;

    private tilesSprites: any[][][];
    private tileTypes: Map<string, any>;
    private tiles!: any[][][];
    private blockSize: number;
    
    constructor(blockSize: number, waterEffectService: WaterEffectService, positionResolver: PositionResolver, 
        resourcesManager: ResourcesManager) {
        this.waterEffectService = waterEffectService;
        this.positionResolver = positionResolver;
        this.resourcesManager = resourcesManager;

        this.tileTypes = new Map();
        this.tilesSprites = [];
        this.blockSize = blockSize;
    }

    loadTileTypes(tileTypes: any[]) {
        tileTypes.forEach(tileType => {
            this.resourcesManager.addTileResource(tileType.src);
            this.tileTypes.set(tileType.type, tileType);
        });
    }

    addTiles(tiles: any[][][], container: PIXI.Container) {
        this.tiles = tiles;
        this.tilesSprites = tiles.map(
            (row, i) => row.map(
                (pile, j) => pile.map(
                    (tile, k) => {
                        const sprite = this.createTileSprite(
                            tile,
                            k > 0 ? tiles[i][j][k - 1] : undefined,
                            i, j, k);
                        container.addChild(sprite);
                        return sprite;
                    }
                )
            )
        );
    }

    getTile(i: number, j: number, k: number): TileSprite {
        return this.tilesSprites[i][j][k];
    }

    isLiquid(i: number, j: number, k: number): boolean {
        return this.tileTypes.get(this.tiles[i][j][k]).liquid;
    }

    private createTileSprite(tile: any, tileUnder: any, i: number, j: number, k: number): TileSprite {
        const tileType = this.tileTypes.get(tile);
        const tileSprite = new TileSprite(this.resourcesManager.get(tileType.src), this.blockSize);

        if (tileType.liquid) {
            let waterfall = false;
            if (k > 0) {
                const tileTypeUnder = this.tileTypes.get(tileUnder);
                waterfall = tileTypeUnder.liquid;
            }
            this.waterEffectService.applyOn(tileSprite, waterfall);
            k -= 0.4;
        }

        this.positionResolver.update(tileSprite, i, j, k);
        return tileSprite;
    }
}