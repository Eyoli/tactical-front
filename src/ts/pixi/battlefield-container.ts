import * as PIXI from 'pixi.js';

export default class BattlefieldContainer extends PIXI.Container {

    constructor() {
        super();
        // sort children by zIndex
        this.sortableChildren = true;
    }
}