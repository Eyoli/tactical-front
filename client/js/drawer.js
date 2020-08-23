const Drawer = (function () {
    const TILES_TEXTURES_REPOSITORY = "public/img/tiles/";
    const UNITS_TEXTURES_REPOSITORY = "public/img/units/";
    const BLOCK_SIZE = 64;
    const SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };

    const resourcesMap = {};

    //Create a Pixi Application
    let app = null;
    const ResourceLoader = PIXI.Loader.shared;

    ResourceLoader.add("fluffy", UNITS_TEXTURES_REPOSITORY + "fluffy-red-opt.json");
    ResourceLoader.add("position", TILES_TEXTURES_REPOSITORY + "blocks_31.png");

    const battlefieldContainer = new BattlefieldContainer(new PositionResolver(SPATIAL_STEP));
    let waterEffectService;
    let tiles;
    let tilesSprites;

    const unitsHolder = new Map();

    return {
        init: (application) => {
            app = application;

            waterEffectService = new WaterEffect(app);

            const P0 = { x: (app.renderer.screen.width / 2), y: (app.renderer.screen.height / 2) };
            battlefieldContainer.position.set(P0.x, P0.y);
            app.stage.addChild(battlefieldContainer);
        },

        load: (tileTypes, callback) => {
            tileTypes.forEach(tileType => {
                tileType.src = TILES_TEXTURES_REPOSITORY + tileType.src;
                ResourceLoader.add(tileType.src);
                resourcesMap[tileType.type] = tileType;
            });
            ResourceLoader.load(callback);
        },

        drawBattlefield: (battlefield) => {
            tiles = battlefield.tiles;
            tilesSprites = tiles.map(
                (row, i) => row.map(
                    (pile, j) => pile.map(
                        (tile, k) => {
                            const tileType = resourcesMap[tiles[i][j][k]];
                            const tileSprite = new TileSprite(ResourceLoader.resources[tileType.src].texture, BLOCK_SIZE);
                            battlefieldContainer.addTile(tileSprite);
                            battlefieldContainer.updatePosition(tileSprite, i, j, k);

                            if (tileType.liquid) {
                                waterEffectService.applyOn(tileSprite);
                            }
                            return tileSprite;
                        }
                    )
                )
            );
        },

        drawUnits: (unitStates, onClickOnUnit) => {
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
                battlefieldContainer.addUnit(unitSprite);
                battlefieldContainer.updatePosition(unitSprite, x, y, z + 1);
                unitsHolder.set(unitState.unit.id, unitSprite);
            });
            battlefieldContainer.sortByZIndex();
        },

        drawPositions(positions, onClickOnPosition) {
            battlefieldContainer.clearPositionTiles();
            positions.forEach(p => {
                const positionTile = new PositionTileSprite(ResourceLoader.resources.position.texture, BLOCK_SIZE);
                positionTile.on('pointerdown', () => onClickOnPosition(p));
                battlefieldContainer.addPositionTile(positionTile, p.x, p.y, p.z);
            });
            battlefieldContainer.sortByZIndex();
        },

        clearPositionTiles() {
            battlefieldContainer.clearPositionTiles();
        },

        updateUnit(unitState, onClickOnUnit) {
            const unitSprite = unitsHolder.get(unitState.unit.id);
            unitSprite.onClick(() => onClickOnUnit(unitState));
            battlefieldContainer.updatePosition(
                unitSprite,
                unitState.position.x,
                unitState.position.y,
                unitState.position.z + 1
            );
            battlefieldContainer.sortByZIndex();
        }
    }
})()