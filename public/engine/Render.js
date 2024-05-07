class Render {

    constructor(gameObjects, fullscreen) {
        this.fullscreen = fullscreen;
        this.gameObjects = gameObjects;
        if (fullscreen) this.renderer = new PIXI.Renderer({
            view: document.getElementById('main'),
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio || 1,
        });
        else
            this.renderer = new PIXI.Renderer({ view: document.getElementById('main') });
        this.stage = new PIXI.Container();
        this.stage.sortableChildren = true;
        this.stage.interactive = true;
    }

    update() {
        this.gameObjects.forEach(gameObject => {
            if (!gameObject.sleeping) gameObject.update();
        });
        this.renderer.render(this.stage);
    }
}