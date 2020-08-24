type SpatialStep = {x: number, y: number, z: number};

export default class PositionResolver {
    private spatialStep: SpatialStep;

    constructor(spatialStep: SpatialStep) {
        this.spatialStep = spatialStep;
    }

    resolve(i: number, j: number, k: number) {
        return {
            x: (j - i) * this.spatialStep.x,
            y: (j + i) * this.spatialStep.y + k * this.spatialStep.z
        };
    }
}