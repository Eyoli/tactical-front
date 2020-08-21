const Drawer = (function () {
    const TILES_TEXTURES_REPOSITORY = "public/img/tiles/";
    const UNITS_TEXTURES_REPOSITORY = "public/img/units/";
    const BLOCK_SIZE = 64;
    const WIDTH = 600;
    const HEIGHT = 600;
    const SPATIAL_STEP = { x: BLOCK_SIZE / 2, y: BLOCK_SIZE / 4, z: -BLOCK_SIZE / 2 };
    const P0 = { x: (WIDTH / 2), y: (HEIGHT / 2) };

    const resourcesMap = {};

    //Create a Pixi Application
    let app = null;
    const ResourceLoader = PIXI.Loader.shared;

    const battlefieldContainer = new PIXI.Container();

    ResourceLoader.add("fluffy", UNITS_TEXTURES_REPOSITORY + "fluffy-red-opt.json");

    const positionResolver = new PositionResolver(SPATIAL_STEP);

    return {
        init: (parentDOM) => {
            app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
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
                        const { x: xReal, y: yReal } = positionResolver.resolve(i, j, k);

                        const resourceName = resourcesMap[battlefield.tiles[i][j][k]];
                        const block = new TileSprite(ResourceLoader.resources[resourceName].texture, BLOCK_SIZE);
                        block.position.set(xReal, yReal);
                        battlefieldContainer.addChild(block);
                    }
                }
            }

            battlefieldContainer.position.set(P0.x, P0.y - (battlefieldContainer.height / 3));
            app.stage.addChild(battlefieldContainer);
        },

        drawUnits: (unitStates, onClickOnUnit) => {
            const fluffyTextures = [];
            for (let i = 0; i < 8; i++) {
                const fluffyTexture = PIXI.Texture.from("fluffy-red-" + i + ".png");
                fluffyTextures.push(fluffyTexture);
            }
            fluffyTextures.push(PIXI.Texture.from("fluffy-red-0.png"));
            
            unitStates.forEach((unitState) => {
                const {position: {x, y, z}} = unitState;
                const { x: xReal, y: yReal } = positionResolver.resolve(x, y, z);
                
                const unit = new UnitSprite(fluffyTextures);
                const scale = BLOCK_SIZE / unit.width;
                unit.scale.set(scale, scale);
                unit.position.set(xReal, yReal);
                unit.zIndex = x + y + z;
                unit.onClick(() => onClickOnUnit(unitState));
                
                battlefieldContainer.addChild(unit);
                battlefieldContainer.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
            });
        },

        drawPositions(positions) {
            
        }
    }
})()