import * as PIXI from 'pixi.js';
import EventManager from '../../game/service/event-manager';
import UIDrawerPort from '../../game/port/ui-drawer-port';
import { Events } from '../../game/enums';
import TacticalStage from '../tactical-stage';
import { UnitState } from '../../game/types';

export default class UIDrawer implements UIDrawerPort {
    private ui: UI;
    private stage: TacticalStage;

    constructor(stage: TacticalStage, eventManager: EventManager) {
        this.stage = stage;

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
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

        this.ui = new UI().withMenu(new Menu(800, 40, style)
            .withButton("Move",
                () => eventManager.dispatch(Events.CLICK_ON_MENU_MOVE))
            .withButton("Attack",
                () => eventManager.dispatch(Events.CLICK_ON_MENU_ATTACK))
            .withButton("End turn",
                () => eventManager.dispatch(Events.CLICK_ON_MENU_NEXT_TURN))
            .withButton("Reset turn",
                () => eventManager.dispatch(Events.CLICK_ON_MENU_RESET_TURN))
            .withButton("Info",
                () => eventManager.dispatch(Events.CLICK_ON_MENU_INFO)));
        this.stage.addChild(this.ui);
        this.ui.parentLayer = this.stage.statsLayer;

        this.close();
    }

    open(unitState: UnitState, active: boolean): void {
        active && !unitState.moved ? this.ui.menus[0].show(0) : this.ui.menus[0].hide(0);
        active && !unitState.acted ? this.ui.menus[0].show(1) : this.ui.menus[0].hide(1);
        active ? this.ui.menus[0].show(2) : this.ui.menus[0].hide(2);
        active ? this.ui.menus[0].show(3) : this.ui.menus[0].hide(3);

        const unitContainer = this.stage.unitsHolder.getUnit(unitState.unit.id);
        const position = unitContainer.toGlobal({ x: 0, y: 0 });
        this.ui.menus[0].position.set(position.x + this.stage.blockSize, position.y);
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
    private dy: number;

    constructor(x: number, dy: number, style: PIXI.TextStyle) {
        super();
        this.style = style;
        this.x = x;
        this.dy = dy;
    }

    hide(index: number): void {
        if (this.children[index].visible) {
            this.children.slice(index + 1).forEach(item => item.y -= this.dy);
        }
        this.children[index].visible = false;
    }

    show(index: number): void {
        if (!this.children[index].visible) {
            this.children.slice(index + 1).forEach(item => item.y += this.dy);
        }
        this.children[index].visible = true;
    }

    withButton(text: string, callback: () => void) {
        const button = new Button(text, this.style, callback);
        button.y = this.children.length * this.dy;
        this.addChild(button);
        return this;
    }
}

class Button extends PIXI.Text {

    constructor(text: string, style: PIXI.TextStyle, callback: () => void) {
        super(text, style);

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', callback);
    }
}