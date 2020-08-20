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
    const app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
    const ResourceLoader = PIXI.Loader.shared;

    const battlefieldContainer = new PIXI.Container();

    ResourceLoader.add("fluffy", UNITS_TEXTURES_REPOSITORY + "fluffy-red-opt.json");

    function onClickOnUnit() {

    }

    function getRealPosition(i, j, k, diff) {
        return {
            x: (j - i) * diff.x,
            y: (j + i) * diff.y + k * diff.z
        };
    }

    return {
        app: app,

        init: (tileTypes, callback) => {
            tileTypes.forEach(t => {
                ResourceLoader.add(TILES_TEXTURES_REPOSITORY + t.src);
                resourcesMap[t.type] = TILES_TEXTURES_REPOSITORY + t.src;
            });

            ResourceLoader.load(callback);
        },

        draw: (battlefield, unitStates) => {
            Drawer.drawBattlefield(battlefield);
            Drawer.drawUnits(unitStates);

            battlefieldContainer.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
            battlefieldContainer.position.set(P0.x, P0.y - (battlefieldContainer.height / 3));
            app.stage.addChild(battlefieldContainer);
        },

        drawBattlefield: (battlefield) => {
            for (let i = 0; i < battlefield.tiles.length; i++) {
                for (let j = 0; j < battlefield.tiles[i].length; j++) {
                    for (let k = 0; k < battlefield.tiles[i][j].length; k++) {
                        const { x: xReal, y: yReal } = getRealPosition(i, j, k, SPATIAL_STEP);

                        const resourceName = resourcesMap[battlefield.tiles[i][j][k]];
                        const block = new PIXI.Sprite(ResourceLoader.resources[resourceName].texture);
                        block.pivot.set(BLOCK_SIZE / 2, BLOCK_SIZE / 2);
                        block.position.set(xReal, yReal);
                        block.width = BLOCK_SIZE;
                        block.height = BLOCK_SIZE;
                        battlefieldContainer.addChild(block);
                    }
                }
            }
        },

        drawUnits: (unitStates) => {
            unitStates.forEach(({ position: { x, y } }) => {
                const { x: xReal, y: yReal } = getRealPosition(x, y, battlefield.tiles[x][y].length - 1, SPATIAL_STEP);
                const unit = new PIXI.Sprite(PIXI.utils.TextureCache["fluffy-red-1.png"]);
                unit.width = unit.texture.width;
                unit.height = unit.texture.height;
                unit.pivot.set(unit.width / 2, unit.height);
                const scale = BLOCK_SIZE / unit.width;
                unit.scale.set(scale, scale);
                unit.position.set(xReal, yReal);
                unit.zIndex = x + y + battlefield.tiles[x][y].length;

                unit.interactive = true;
                unit.buttonMode = true;
                unit.on('pointerdown', onClickOnUnit);

                battlefieldContainer.addChild(unit);
            });
        }
    }
})()