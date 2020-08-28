import { Container, Polygon, Graphics } from "pixi.js";

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
            .beginFill(0x0000FF)
            // .drawRect(0, 0, fraction * this.length, 0.1 * this.length)
            .drawRect(0, 0, 200, 200)
            .endFill();
            console.log(this.bar);
    }
}