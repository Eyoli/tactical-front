import * as PIXI from 'pixi.js';
import EventManager from '../../game/service/event-manager';
import UIPort from '../../game/port/ui-port';
import { Events, Mode } from '../../game/enums';

export default class TacticalUI implements UIPort {
    ui: UI;

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

        this.ui = new UI().withMenu(new Menu(800, style)
            .withButton("Move", 30,
                () => eventManager.dispatch(Events.CLICK_ON_MENU_MOVE))
            .withButton("Attack", 80,
                () => eventManager.dispatch(Events.CLICK_ON_MENU_ATTACK))
            .withButton("End turn", 130,
                () => eventManager.dispatch(Events.CLICK_ON_MENU_NEXT_TURN))
            .withButton("Reset turn", 180,
                () => eventManager.dispatch(Events.CLICK_ON_MENU_RESET_TURN)));
        app.stage.addChild(this.ui);
    }

    hideEntry(mode: Mode): void {
        if (mode === Mode.MOVE) {
            this.ui.menus[0].hide(0);
        } else if (mode === Mode.ACT) {
            this.ui.menus[0].hide(1);
        }
    }

    showEntry(mode: Mode): void {
        if (mode === Mode.MOVE) {
            this.ui.menus[0].show(0);
        } else if (mode === Mode.ACT) {
            this.ui.menus[0].show(1);
        }
    }

    open(): void {
        this.ui.visible = true;
    }

    close(): void {
        this.ui.visible = false;
    }
}

class UI extends PIXI.Container {
    readonly menus: Menu[];

    constructor() {
        super();
        this.menus = [];
    }

    withMenu(menu: Menu): UI {
        this.menus.push(menu);
        this.addChild(menu);
        return this;
    }
}

class Menu extends PIXI.Container {
    private style: PIXI.TextStyle;

    constructor(x: number, style: PIXI.TextStyle) {
        super();
        this.style = style;
        this.x = x;
    }

    hide(index: number): void {
        this.children[index].visible = false;
    }

    show(index: number): void {
        this.children[index].visible = true;
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