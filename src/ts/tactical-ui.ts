import * as PIXI from 'pixi.js';
import { EventManager, TacticalEvent } from './event-manager';

export default class TacticalUI {

    constructor(app: PIXI.Application, eventManager: EventManager) {
        const style = new PIXI.TextStyle({
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

        const ui = new UI().withMenu(800, style)
            .withButton("Move", 30,
                () => eventManager.dispatchEvent(TacticalEvent.EVENT_CLICK_ON_MENU_MOVE))
            .withButton("Attack", 80,
                () => eventManager.dispatchEvent(TacticalEvent.EVENT_CLICK_ON_MENU_ATTACK))
            .withButton("End turn", 130,
                () => eventManager.dispatchEvent(TacticalEvent.EVENT_CLICK_ON_MENU_NEXT_TURN))
            .withButton("Reset turn", 180,
                () => eventManager.dispatchEvent(TacticalEvent.EVENT_CLICK_ON_MENU_RESET_TURN));
        app.stage.addChild(ui);
    }
}

class UI extends PIXI.Container {

    constructor() {
        super();
    }

    withMenu(x: number, style: PIXI.TextStyle) {
        const menu = new Menu(800, style);
        menu.x = x;
        this.addChild(menu);
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