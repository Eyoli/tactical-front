import * as PIXI from 'pixi.js';

export default class BattlefieldContainer extends PIXI.Container {

    constructor() {
        super();
        // sort children by zIndex
        this.sortableChildren = true;

        // Handle zoom on mousewheel event
        this.interactive = true;
        this.on('mousewheel', (ev: any) => {
            if (ev.wheelDelta > 0) {
                this.scale.set(
                    Math.min(2, this.scale.x + 0.1),
                    Math.min(2, this.scale.y + 0.1)
                );
            } else {
                this.scale.set(
                    Math.max(0.5, this.scale.x - 0.1),
                    Math.max(0.5, this.scale.y - 0.1)
                );
            }
        });
    }
}