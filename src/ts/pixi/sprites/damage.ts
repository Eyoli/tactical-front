import { Container, Ticker, Text } from "pixi.js";

export default class Damage extends Text {

    constructor() {
        super("", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        }));
    }

    display(damage: number, x: number, y: number) {
        this.text = damage.toString();
        this.alpha = 1;
        this.x = x;
        this.y = y;
        Ticker.shared.add(this.animate, this);
    }

    private animate() {
        this.alpha -= 0.01;
        if (this.alpha <= 0) {
            Ticker.shared.remove(this.animate, this);
        }
    }
}