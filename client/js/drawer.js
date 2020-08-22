const Drawer = (function () {
    const TILES_TEXTURES_REPOSITORY = "public/img/tiles/";
    const UNITS_TEXTURES_REPOSITORY = "public/img/units/";
    const BLOCK_SIZE = 64;
    const WIDTH = 1000;
    const HEIGHT = 600;
    const SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };
    const P0 = { x: (WIDTH / 2), y: (HEIGHT / 2) };

    const resourcesMap = {};

    //Create a Pixi Application
    let app = null;
    const ResourceLoader = PIXI.Loader.shared;

    ResourceLoader.add("fluffy", UNITS_TEXTURES_REPOSITORY + "fluffy-red-opt.json");
    ResourceLoader.add("position", TILES_TEXTURES_REPOSITORY + "blocks_31.png");

    const battlefieldContainer = new BattlefieldContainer(new PositionResolver(SPATIAL_STEP));
    battlefieldContainer.position.set(P0.x, P0.y);

    const unitsHolder = new Map();

    return {
        init: (parentDOM) => {
            app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
            app.stage.addChild(battlefieldContainer);

            parentDOM.appendChild(app.view);
        },

        load: (tileTypes, callback) => {
            tileTypes.forEach(t => {
                ResourceLoader.add(TILES_TEXTURES_REPOSITORY + t.src);
                resourcesMap[t.type] = TILES_TEXTURES_REPOSITORY + t.src;
            });

            ResourceLoader.load(callback);
        },

        drawBattlefield: (battlefield) => {
            for (let i = 0; i < battlefield.tiles.length; i++) {
                for (let j = 0; j < battlefield.tiles[i].length; j++) {
                    for (let k = 0; k < battlefield.tiles[i][j].length; k++) {
                        const resourceName = resourcesMap[battlefield.tiles[i][j][k]];
                        const tile = new TileSprite(ResourceLoader.resources[resourceName].texture, BLOCK_SIZE);
                        battlefieldContainer.addTile(tile, i, j, k);
                    }
                }
            }
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
                battlefieldContainer.addUnit(unitSprite, x, y, z + 1);
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

        updateUnit(unitState) {
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