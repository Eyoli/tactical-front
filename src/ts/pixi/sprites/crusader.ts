import * as PIXI from 'pixi.js';
import ResourcesManager from "../service/resources-manager";

abstract class CrusaderIdle extends PIXI.AnimatedSprite {

    protected prepareAnimation(min: number, max: number) {
        setTimeout(
            (() => {
                this.gotoAndPlay(0);
                this.prepareAnimation(min, max);
            }).bind(this),
            min + Math.random() * (max - min));
    }
}

class Right extends CrusaderIdle {

    constructor(size: number, resourcesManager: ResourcesManager) {
        const textures = [];
        for (let i = 0; i < 16; i++) {
            const name = "crusader_idle_100" + i.toString().padStart(2, '0');
            const texture = resourcesManager.get(name);
            textures.push(texture);
        }

        super(textures);

        // animation
        this.animationSpeed = 0.1;
        this.loop = false;

        const scale = size / 155;
        this.scale.set(scale, scale);

        this.hitArea = new PIXI.Polygon([
            110, 24,
            110, 179,
            181, 179,
            181, 24
        ]);

        this.pivot.set(71, 50);

        this.prepareAnimation(3000, 5000);
    }
}

class Up extends CrusaderIdle {

    constructor(size: number, resourcesManager: ResourcesManager) {
        const textures = [];
        for (let i = 0; i < 16; i++) {
            const name = "crusader_idle_300" + i.toString().padStart(2, '0');
            const texture = resourcesManager.get(name);
            textures.push(texture);
        }

        super(textures);

        // animation
        this.animationSpeed = 0.1;
        this.loop = false;

        const scale = size / 155;
        this.scale.set(scale, scale);

        this.hitArea = new PIXI.Polygon([
            110, 24,
            110, 179,
            181, 179,
            181, 24
        ]);

        this.pivot.set(71, 50);

        this.prepareAnimation(3000, 5000);
    }
}

class Left extends CrusaderIdle {

    constructor(size: number, resourcesManager: ResourcesManager) {
        const textures = [];
        for (let i = 0; i < 16; i++) {
            const name = "crusader_idle_500" + i.toString().padStart(2, '0');
            const texture = resourcesManager.get(name);
            textures.push(texture);
        }

        super(textures);

        // animation
        this.animationSpeed = 0.1;
        this.loop = false;

        const scale = size / 155;
        this.scale.set(scale, scale);

        this.hitArea = new PIXI.Polygon([
            110, 24,
            110, 179,
            181, 179,
            181, 24
        ]);

        this.pivot.set(71, 50);

        this.prepareAnimation(3000, 5000);
    }
}

class Down extends CrusaderIdle {

    constructor(size: number, resourcesManager: ResourcesManager) {
        const textures = [];
        for (let i = 0; i < 16; i++) {
            const name = "crusader_idle_700" + i.toString().padStart(2, '0');
            const texture = resourcesManager.get(name);
            textures.push(texture);
        }

        super(textures);

        // animation
        this.animationSpeed = 0.1;
        this.loop = false;

        const scale = size / 155;
        this.scale.set(scale, scale);

        this.hitArea = new PIXI.Polygon([
            110, 24,
            110, 179,
            181, 179,
            181, 24
        ]);

        this.pivot.set(71, 50);

        this.prepareAnimation(3000, 5000);
    }
}

const Crusader = {
    Idle: { Down, Up, Left, Right }
};
export default Crusader;