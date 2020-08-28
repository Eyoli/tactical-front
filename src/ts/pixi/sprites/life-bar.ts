import { Container, Graphics } from "pixi.js";

export default class LifeBar extends Container {
    private bar: Graphics;
    private length: number

    constructor(length: number) {
        super();

        this.length = length;
        this.bar = new Graphics();
        this.addChild(this.bar);
    }

    update(fraction: number) {
        this.bar
            .clear()
            .beginFill(0xFF0000)
            .drawRect(0, 0, fraction * this.length, 0.1 * this.length)
            .endFill();
    }
}