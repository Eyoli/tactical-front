import { Position } from "../../game/types";
import { UnitContainer } from "../sprites/unit-container";
import { Direction } from "../../game/enums";

abstract class Animation<T> {
    protected readonly object: T;
    private callbackOnComplete?: Function;
    private callbackOnUpdate?: Function;

    constructor(object: T) {
        this.object = object;
    }

    onUpdate(callback: Function) {
        this.callbackOnUpdate = callback;
    }

    onComplete(callback: Function) {
        this.callbackOnComplete = callback;
    }

    start() {
        PIXI.Ticker.shared.add(this.update, this);
    }

    stop() {
        PIXI.Ticker.shared.remove(this.update, this);
        if (this.callbackOnComplete) {
            this.callbackOnComplete(this.object);
        }
    }

    private update() {
        const data = this.animate();
        if (this.callbackOnUpdate) {
            this.callbackOnUpdate(data);
        }
    }

    abstract animate(): any;
}

export default class MoveAnimation extends Animation<UnitContainer> {
    private readonly path: Position[];
    private p: { x: number, y: number, z: number };
    private next = 0;
    private delta = 0.1;
    private sign = { x: 0, y: 0, z: 0 };

    constructor(unitContainer: UnitContainer, path: Position[]) {
        super(unitContainer);
        this.path = path;
        this.p = this.path[0];
        this.updateTarget();
    }

    private updateTarget() {
        this.p = this.path[this.next];
        this.next++;
        if (this.next >= this.path.length) {
            this.stop();
        } else {
            this.sign.x = Math.sign(this.path[this.next].x - this.p.x);
            this.sign.y = Math.sign(this.path[this.next].y - this.p.y);
            this.sign.z = Math.sign(this.path[this.next].z - this.p.z);

            if (this.sign.x < 0) {
                this.object.move(Direction.UP);
            } else if (this.sign.x > 0) {
                this.object.move(Direction.DOWN);
            } else if (this.sign.y > 0) {
                this.object.move(Direction.RIGHT);
            } else {
                this.object.move(Direction.LEFT);
            }
        }
    }

    animate() {
        this.p.x += this.sign.x * this.delta;
        this.p.y += this.sign.y * this.delta;
        this.p.z += this.sign.z * this.delta;
        if (Math.abs(this.path[this.next].x - this.p.x) <= this.delta
            && Math.abs(this.path[this.next].y - this.p.y) <= this.delta
            && Math.abs(this.path[this.next].z - this.p.z) <= this.delta) {
            this.updateTarget();
        }
        return this.p;
    }
}