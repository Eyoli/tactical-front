type SpatialStep = {x: number, y: number, z: number};

export default class PositionResolver {
    private spatialStep: SpatialStep;

    constructor(spatialStep: SpatialStep) {
        this.spatialStep = spatialStep;
    }

    update(sprite: PIXI.DisplayObject, i: number, j: number, k: number) {
        const { x: xReal, y: yReal } = {
            x: (j - i) * this.spatialStep.x,
            y: (j + i) * this.spatialStep.y + k * this.spatialStep.z
        };
        sprite.position.set(xReal, yReal);
        sprite.zIndex = i + j + k;
    }
}