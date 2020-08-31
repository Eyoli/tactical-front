import { Position } from "../../game/types";

type SpatialStep = {x: number, y: number, z: number};

export default class PositionResolver {
    private spatialStep: SpatialStep;

    constructor(spatialStep: SpatialStep) {
        this.spatialStep = spatialStep;
    }

    update(sprite: PIXI.DisplayObject, p: Position) {
        const { x: xReal, y: yReal } = {
            x: (p.y - p.x) * this.spatialStep.x,
            y: (p.y + p.x) * this.spatialStep.y + p.z * this.spatialStep.z
        };
        sprite.position.set(xReal, yReal);
        sprite.zIndex = p.x + p.y + p.z;
    }
}