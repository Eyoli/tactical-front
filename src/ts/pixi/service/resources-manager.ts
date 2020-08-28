import path from 'path';

const UNITS_TEXTURES_REPOSITORY = "./assets/units";
const TILES_TEXTURES_REPOSITORY = "./assets/tiles";

export default class ResourcesManager {
    private loader = PIXI.Loader.shared;

    constructor() {
        this.loader.add("fluffy", path.join(UNITS_TEXTURES_REPOSITORY, "fluffy-red-opt.json"));
    }

    addTileResource(key: string) {
        this.loader.add(key, path.join(TILES_TEXTURES_REPOSITORY, key));
    }

    loadThen(callback: any) {
        this.loader.load(callback);
    }

    get(key: string): PIXI.Texture {
        return this.loader.resources[key].texture;
    }
}