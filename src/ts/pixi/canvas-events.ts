import * as PIXI from 'pixi.js';

const mousePosition = new PIXI.Point();

// cache a global mouse position to keep from 
// creating a point every event

// Listen for global events on the <canvas> element
// and convert those into event

export const handleMouseDrag = (app: PIXI.Application) => {
    app.view.addEventListener('dragstart', createEventListener(app, 'dragstart'));
    app.view.addEventListener('drag', createEventListener(app, 'drag'));
    app.view.addEventListener('dragend', createEventListener(app, 'dragend'));
}

export const handleMouseWheel = (app: PIXI.Application) => {
    app.view.addEventListener('mousewheel', createEventListener(app, 'mousewheel'));
}

function createEventListener(app: PIXI.Application, name: string) {
    return (ev: any) => {
        mousePosition.set(ev.clientX, ev.clientY); // get global position

        // returns element directly under mouse
        const found = app.renderer.plugins.interaction.hitTest(mousePosition, app.stage);

        // Dispatch event
        if (found) { found.emit(name, ev); }
    }
}