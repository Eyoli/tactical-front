import WaterEffectService from "./service/water-effect-service";
import TileSprite from "./sprites/tile-sprite";
import * as PIXI from "pixi.js";
import PositionResolver from "./service/position-resolver";
import path from 'path';
import ResourcesManager from "./service/resources-manager";
import PositionSprite from "./sprites/position-sprite";
import { Position } from "../game/types";

export default class FieldHolder {
    private waterEffectService: WaterEffectService;
    private positionResolver: PositionResolver;
    private resourcesManager: ResourcesManager;

    private tilesSprites: any[][][];
    private positionsSprites: PositionSprite[];
    private tileTypes: Map<string, any>;
    private tiles!: any[][][];
    private blockSize: number;

    constructor(blockSize: number, waterEffectService: WaterEffectService, positionResolver: PositionResolver,
        resourcesManager: ResourcesManager) {
        this.waterEffectService = waterEffectService;
        this.positionResolver = positionResolver;
        this.resourcesManager = resourcesManager;

        this.tileTypes = new Map();
        this.positionsSprites = [];
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
                            {x: i, y: j, z: k});
                        container.addChild(sprite);
                        return sprite;
                    }
                )
            )
        );
    }

    addPositionTile(color: number, p: Position, container: PIXI.Container) {
        const sprite = this.tilesSprites[p.x][p.y][p.z];
        const positionTile = new PositionSprite(sprite.width, sprite.height, color);
        container.addChild(positionTile);

        this.positionResolver.update(positionTile, p);
        this.positionsSprites.push(positionTile);
        return positionTile;
    }

    clearPositionTiles(container: PIXI.Container) {
        container.removeChild(...this.positionsSprites);
        this.positionsSprites = [];
    }

    isLiquid(p: Position): boolean {
        return this.tileTypes.get(this.tiles[p.x][p.y][p.z]).liquid;
    }

    private createTileSprite(tile: any, tileUnder: any, p: Position): TileSprite {
        const tileType = this.tileTypes.get(tile);
        const tileSprite = new TileSprite(this.resourcesManager.get(tileType.src), this.blockSize);
        let z = p.z;

        if (tileType.liquid) {
            let waterfall = false;
            if (p.z > 0) {
                const tileTypeUnder = this.tileTypes.get(tileUnder);
                waterfall = tileTypeUnder.liquid;
            }
            this.waterEffectService.applyOn(tileSprite, waterfall);
            p.z -= 0.4;
        }

        this.positionResolver.update(tileSprite, p);
        return tileSprite;
    }
}