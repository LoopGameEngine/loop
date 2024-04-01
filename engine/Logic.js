class Logic {

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
    }

    fixedUpdate(dt, scope) {
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedUpdate(dt, scope)
        })
        Input.restartInput();
    }
}