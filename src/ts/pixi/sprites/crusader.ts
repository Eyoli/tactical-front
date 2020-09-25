import * as PIXI from 'pixi.js';
import { Direction } from '../../game/enums';
import ResourcesManager from "../service/resources-manager";
import { UnitContainer, UnitMode } from './unit-container';

class Idle extends PIXI.AnimatedSprite {

    constructor(direction: Direction, size: number, resourcesManager: ResourcesManager) {
        let prefix = '';
        switch (direction) {
            case Direction.RIGHT:
                prefix = "crusader_idle_100";
                break;
            case Direction.UP:
                prefix = "crusader_idle_300";
                break;
            case Direction.LEFT:
                prefix = "crusader_idle_500";
                break;
            case Direction.DOWN:
                prefix = "crusader_idle_700";
                break;
        }

        const textures = [];
        for (let i = 0; i < 16; i++) {
            const texture = resourcesManager.get(prefix + i.toString().padStart(2, '0'));
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

    private prepareAnimation(min: number, max: number): void {
        setTimeout(
            (() => {
                this.gotoAndPlay(0);
                this.prepareAnimation(min, max);
            }).bind(this),
            min + Math.random() * (max - min));
    }
}

class Move extends PIXI.AnimatedSprite {

    constructor(direction: Direction, size: number, resourcesManager: ResourcesManager) {
        let prefix = '';
        switch (direction) {
            case Direction.RIGHT:
                prefix = "crusader_walk_100";
                break;
            case Direction.UP:
                prefix = "crusader_walk_300";
                break;
            case Direction.LEFT:
                prefix = "crusader_walk_500";
                break;
            case Direction.DOWN:
                prefix = "crusader_walk_700";
                break;
        }

        const textures = [];
        for (let i = 0; i < 15; i++) {
            const texture = resourcesManager.get(prefix + i.toString().padStart(2, '0'));
            textures.push(texture);
        }

        super(textures);

        // animation
        this.animationSpeed = 0.5;

        const scale = size / 155;
        this.scale.set(scale, scale);

        this.pivot.set(71, 50);
    }
}

export default class Crusader extends UnitContainer {

    constructor(blockSize: number, resourcesManager: ResourcesManager) {
        super(blockSize);
        this
            .withIdleMode(new UnitMode()
                .withFace(Direction.LEFT, new Idle(Direction.LEFT, blockSize, resourcesManager))
                .withFace(Direction.UP, new Idle(Direction.UP, blockSize, resourcesManager))
                .withFace(Direction.RIGHT, new Idle(Direction.RIGHT, blockSize, resourcesManager))
                .withFace(Direction.DOWN, new Idle(Direction.DOWN, blockSize, resourcesManager)))
            .withMoveMode(new UnitMode()
                .withFace(Direction.LEFT, new Move(Direction.LEFT, blockSize, resourcesManager))
                .withFace(Direction.UP, new Move(Direction.UP, blockSize, resourcesManager))
                .withFace(Direction.RIGHT, new Move(Direction.RIGHT, blockSize, resourcesManager))
                .withFace(Direction.DOWN, new Move(Direction.DOWN, blockSize, resourcesManager)));
    }
}
