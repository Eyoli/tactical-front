class TacticalUI {

    constructor(application) {
        this.app = application;
        this.style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });
    }

    drawNextTurnButton(callback) {
        const nextTurnButton = new Button('Next turn', this.style, callback);
        nextTurnButton.x = 800;
        nextTurnButton.y = 30;
        this.app.stage.addChild(nextTurnButton);
    }

    drawResetTurnButton(callback) {
        const resetTurnButton = new Button('Reset turn', this.style, callback);
        resetTurnButton.x = 800;
        resetTurnButton.y = 80;
        this.app.stage.addChild(resetTurnButton);
    }
}

class Button extends PIXI.Text {

    constructor(text, style, callback) {
        super(text, style);

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', callback);
    }
}