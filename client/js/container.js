class BattlefieldContainer extends PIXI.Container {

    constructor(positionResolver) {
        super();
        this.positionResolver = positionResolver;
        this.positionsSprites = [];
    }

    addTile(tileSprite) {
        this.addChild(tileSprite);
    }

    addUnit(unitSprite) {
        this.addChild(unitSprite);
    }

    updatePosition(sprite, i, j, k) {
        const { x: xReal, y: yReal } = this.positionResolver.resolve(i, j, k);
        sprite.position.set(xReal, yReal);
        sprite.zIndex = i + j + k;
    }

    clearPositionTiles() {
        this.removeChild(...this.positionsSprites);
        this.positionsSprites = [];
    }

    addPositionTile(positionTile, i, j, k) {
        this.addTile(positionTile);
        this.updatePosition(positionTile, i, j, k);
        const mask = positionTile.getMask();
        this.addChild(mask);
        this.positionsSprites.push(positionTile);
        this.positionsSprites.push(mask);
    }

    sortByZIndex() {
        this.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }
}