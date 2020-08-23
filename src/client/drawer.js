TILES_TEXTURES_REPOSITORY = "public/img/tiles/";
UNITS_TEXTURES_REPOSITORY = "public/img/units/";
BLOCK_SIZE = 64;
SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };
ResourceLoader = PIXI.Loader.shared;

class Drawer {

    constructor(application) {
        this.app = application;
        this.resourcesMap = {};
        this.unitsHolder = new Map();
        this.battlefieldContainer = new BattlefieldContainer(new PositionResolver(SPATIAL_STEP));
        this.waterEffectService = new WaterEffect(this.app);

        const P0 = { x: (this.app.renderer.screen.width / 2), y: (this.app.renderer.screen.height / 2) };
        this.battlefieldContainer.position.set(P0.x, P0.y);
        this.app.stage.addChild(this.battlefieldContainer);

        ResourceLoader.add("fluffy", UNITS_TEXTURES_REPOSITORY + "fluffy-red-opt.json");
        ResourceLoader.add("position", TILES_TEXTURES_REPOSITORY + "blocks_31.png");
    }

    load(tileTypes, callback) {
        tileTypes.forEach(tileType => {
            tileType.src = TILES_TEXTURES_REPOSITORY + tileType.src;
            ResourceLoader.add(tileType.src);
            this.resourcesMap[tileType.type] = tileType;
        });
        ResourceLoader.load(callback);
    }

    drawBattlefield(battlefield) {
        this.tiles = battlefield.tiles;
        this.tilesSprites = this.tiles.map(
            (row, i) => row.map(
                (pile, j) => pile.map(
                    (tile, k) => {
                        const tileType = this.resourcesMap[tile];
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

    drawUnits(unitStates, onClickOnUnit) {
        const fluffyTextures = [];
        for (let i = 0; i < 8; i++) {
            const fluffyTexture = PIXI.Texture.from("fluffy-red-" + i + ".png");
            fluffyTextures.push(fluffyTexture);
        }
        fluffyTextures.push(PIXI.Texture.from("fluffy-red-0.png"));

        unitStates.forEach(unitState => {
            const { position: { x, y, z } } = unitState;
            const unitSprite = new UnitSprite(fluffyTextures, BLOCK_SIZE);
            unitSprite.onClick(() => onClickOnUnit(unitState));
            this.battlefieldContainer.addUnit(unitSprite);
            this.updateUnitPosition(unitSprite, x, y, z);
            this.unitsHolder.set(unitState.unit.id, unitSprite);
        });
        this.battlefieldContainer.sortByZIndex();
    }

    drawPositions(positions, onClickOnPosition) {
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

    updateUnit(unitState, onClickOnUnit) {
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

    updateUnitPosition(unitSprite, x, y, z) {
        const tileType = this.resourcesMap[this.tiles[x][y][z]];
        if (tileType.liquid) {
            z += 2 / 3;
        } else {
            z += 1;
        }
        this.battlefieldContainer.updatePosition(unitSprite, x, y, z);
    }
}