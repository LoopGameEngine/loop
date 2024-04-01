class Render {

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
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