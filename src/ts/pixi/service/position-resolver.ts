import { Position } from "../../game/types";

type SpatialStep = {x: number, y: number, z: number};

export default class PositionResolver {
    private spatialStep: SpatialStep;
    private offset: Position = {x: 0, y: 0, z: 0};

    constructor(spatialStep: SpatialStep) {
        this.spatialStep = spatialStep;
    }

    withOffset(offset: Position) {
        this.offset = offset;
    }

    update(sprite: PIXI.DisplayObject, p: Position) {
        const { x: xReal, y: yReal } = {
            x: (this.offset.y + p.y - this.offset.x - p.x) * this.spatialStep.x,
            y: (this.offset.y + p.y + this.offset.x + p.x) * this.spatialStep.y + (this.offset.z + p.z) * this.spatialStep.z
        };
        sprite.position.set(xReal, yReal);
        sprite.zIndex = p.x + p.y + p.z;
    }
}