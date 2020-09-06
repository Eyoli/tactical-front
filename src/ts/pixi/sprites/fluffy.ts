import UnitContainer from "./unit-container";

export default class Fluffy extends PIXI.AnimatedSprite {
    private static textures: PIXI.Texture[];

    constructor(size: number) {
        super(Fluffy.getTexture());

        const scale = size / this.texture.width;
        this.scale.set(scale, scale);

        this.hitArea = new PIXI.Polygon([
            Fluffy.textures[0].trim.x, Fluffy.textures[0].trim.y,
            Fluffy.textures[0].trim.x + Fluffy.textures[0].trim.width, Fluffy.textures[0].trim.y,
            Fluffy.textures[0].trim.x + Fluffy.textures[0].trim.width, Fluffy.textures[0].trim.y + Fluffy.textures[0].trim.height,
            Fluffy.textures[0].trim.x, Fluffy.textures[0].trim.y + Fluffy.textures[0].trim.height
        ]);

        this.pivot.set(0, this.texture.height / 2);
    }

    private static getTexture() {
        if (!this.textures) {
            this.textures = [];
            for (let i = 0; i < 8; i++) {
                const fluffyTexture = PIXI.Texture.from("fluffy-red-" + i + ".png");
                this.textures.push(fluffyTexture);
            }
            this.textures.push(PIXI.Texture.from("fluffy-red-0.png"));
        }
        return this.textures;
    }
}