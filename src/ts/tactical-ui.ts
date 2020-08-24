import * as PIXI from 'pixi.js';

export default class TacticalUI {
    private style: PIXI.TextStyle;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        }); 
    }

    withMenu(x: number) {
        const menu = new Menu(800, this.style);
        menu.x = x;
        this.app.stage.addChild(menu);
        return menu;
    }
}

class Menu extends PIXI.Container {
    private style: PIXI.TextStyle;

    constructor(x: number, style: PIXI.TextStyle) {
        super();
        this.style = style;
        this.x = x;
    }

    withButton(text: string, y: number, callback: Function) {
        const button = new Button(text, this.style, callback);
        button.y = y;
        this.addChild(button);
        return this;
    }
}

class Button extends PIXI.Text {

    constructor(text: string, style: PIXI.TextStyle, callback: Function) {
        super(text, style);

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', callback);
    }
}