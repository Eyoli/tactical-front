import path from 'path';

const TEXTURES_REPOSITORY = "./assets";

export default class ResourcesManager {
    private loader = PIXI.Loader.shared;

    constructor() {
        this.loader.add("fluffy", path.join(TEXTURES_REPOSITORY, "units", "fluffy-red-opt.json"));

        for (let i = 0; i < 16; i++) {
            const crusader = {
                idle: {
                    right: `crusader_idle_100${ i.toString().padStart(2, '0') }`,
                    up: `crusader_idle_300${ i.toString().padStart(2, '0') }`,
                    left: `crusader_idle_500${ i.toString().padStart(2, '0') }`,
                    down: `crusader_idle_700${ i.toString().padStart(2, '0') }`,
                },
                walk: {
                    right: `crusader_walk_100${ i.toString().padStart(2, '0') }`,
                    up: `crusader_walk_300${ i.toString().padStart(2, '0') }`,
                    left: `crusader_walk_500${ i.toString().padStart(2, '0') }`,
                    down: `crusader_walk_700${ i.toString().padStart(2, '0') }`,
                }
            }
            for (const mode of Object.entries(crusader)) {
                for (const direction of Object.entries(mode[1])) {
                    this.loader.add(direction[1], 
                        path.join(TEXTURES_REPOSITORY, "crusader", mode[0], direction[1] + ".png"));
                }
            }
            
        }
    }

    addTileResource(key: string): void {
        this.loader.add(key, path.join(TEXTURES_REPOSITORY, key));
    }

    loadThen(callback: () => void): void {
        this.loader.load(callback);
    }

    get(key: string): PIXI.Texture {
        return this.loader.resources[key].texture;
    }
}