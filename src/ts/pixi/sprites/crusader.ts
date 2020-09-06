import * as PIXI from 'pixi.js';
import ResourcesManager from "../service/resources-manager";

export class CrusaderRight extends PIXI.AnimatedSprite {
    private static textures: PIXI.Texture[];

    constructor(size: number, resourcesManager: ResourcesManager) {
        super(CrusaderRight.getTextures(resourcesManager));

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

        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private prepareAnimation() {
        this.gotoAndPlay(0);
        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private static getTextures(resourcesManager: ResourcesManager) {
        if (!this.textures) {
            this.textures = [];
            for (let i = 0; i < 16; i++) {
                const name = "crusader_idle_100" + i.toString().padStart(2, '0');
                const texture = resourcesManager.get(name);
                this.textures.push(texture);
            }
        }
        return this.textures;
    }
}

export class CrusaderUp extends PIXI.AnimatedSprite {
    private static textures: PIXI.Texture[];

    constructor(size: number, resourcesManager: ResourcesManager) {
        super(CrusaderUp.getTextures(resourcesManager));

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

        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private prepareAnimation() {
        this.gotoAndPlay(0);
        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private static getTextures(resourcesManager: ResourcesManager) {
        if (!this.textures) {
            this.textures = [];
            for (let i = 0; i < 16; i++) {
                const name = "crusader_idle_300" + i.toString().padStart(2, '0');
                const texture = resourcesManager.get(name);
                this.textures.push(texture);
            }
        }
        return this.textures;
    }
}

export class CrusaderLeft extends PIXI.AnimatedSprite {
    private static textures: PIXI.Texture[];

    constructor(size: number, resourcesManager: ResourcesManager) {
        super(CrusaderLeft.getTextures(resourcesManager));

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

        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private prepareAnimation() {
        this.gotoAndPlay(0);
        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private static getTextures(resourcesManager: ResourcesManager) {
        if (!this.textures) {
            this.textures = [];
            for (let i = 0; i < 16; i++) {
                const name = "crusader_idle_500" + i.toString().padStart(2, '0');
                const texture = resourcesManager.get(name);
                this.textures.push(texture);
            }
        }
        return this.textures;
    }
}

export class CrusaderDown extends PIXI.AnimatedSprite {
    private static textures: PIXI.Texture[];

    constructor(size: number, resourcesManager: ResourcesManager) {
        super(CrusaderDown.getTextures(resourcesManager));

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

        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private prepareAnimation() {
        this.gotoAndPlay(0);
        setTimeout(this.prepareAnimation.bind(this), 3000 + Math.random() * 2000);
    }

    private static getTextures(resourcesManager: ResourcesManager) {
        if (!this.textures) {
            this.textures = [];
            for (let i = 0; i < 16; i++) {
                const name = "crusader_idle_700" + i.toString().padStart(2, '0');
                const texture = resourcesManager.get(name);
                this.textures.push(texture);
            }
        }
        return this.textures;
    }
}