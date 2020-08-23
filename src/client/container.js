class BattlefieldContainer extends PIXI.Container {

    constructor(positionResolver) {
        super();
        this.positionResolver = positionResolver;
        this.positionsSprites = [];
    }

    addTile(tileSprite, i, j, k) {
        this.addChild(tileSprite);
        this.updatePosition(tileSprite, i, j, k);
    }

    addUnit(unitSprite) {
        this.addChild(unitSprite);
    }

    updatePosition(sprite, i, j, k, liquid = false) {
        if (liquid) {
            k -= 1/2;
        }
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
        this.positionsSprites.push(positionTile);
    }

    sortByZIndex() {
        this.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }
}