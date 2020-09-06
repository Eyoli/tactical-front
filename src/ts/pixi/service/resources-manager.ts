import path from 'path';

const TEXTURES_REPOSITORY = "./assets";

export default class ResourcesManager {
    private loader = PIXI.Loader.shared;

    constructor() {
        this.loader.add("fluffy", path.join(TEXTURES_REPOSITORY, "units", "fluffy-red-opt.json"));

        for (let i = 0; i < 16; i++) {
            const rightIdle = "crusader_idle_100" + i.toString().padStart(2, '0');
            const upIdle = "crusader_idle_300" + i.toString().padStart(2, '0');
            const leftIdle = "crusader_idle_500" + i.toString().padStart(2, '0');
            const downIdle = "crusader_idle_700" + i.toString().padStart(2, '0');
            this.loader.add(downIdle, path.join(TEXTURES_REPOSITORY, "crusader", "idle", downIdle + ".png"));
            this.loader.add(upIdle, path.join(TEXTURES_REPOSITORY, "crusader", "idle", upIdle + ".png"));
            this.loader.add(rightIdle, path.join(TEXTURES_REPOSITORY, "crusader", "idle", rightIdle + ".png"));
            this.loader.add(leftIdle, path.join(TEXTURES_REPOSITORY, "crusader", "idle", leftIdle + ".png"));
        }
    }

    addTileResource(key: string) {
        this.loader.add(key, path.join(TEXTURES_REPOSITORY, key));
    }

    loadThen(callback: any) {
        this.loader.load(callback);
    }

    get(key: string): PIXI.Texture {
        return this.loader.resources[key].texture;
    }
}