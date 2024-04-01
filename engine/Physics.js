class Physics {
    static pixelsPerMeter = 50;
    static metersPerPixel = 1 / this.pixelsPerMeter;

    constructor(gameObjects) {
        this.gameObjects = gameObjects;
        this.world = planck.World({ allowSleep: false });
        this.world.on('begin-contact', this.collisionBeginHandler.bind(this));
        this.world.on('end-contact', this.collisionEndHandler.bind(this));
    }

    fixedStep(dt) {
        this.world.step(dt);
        this.gameObjects.forEach(gameObject => {
            gameObject.fixedStep();
        })
    }

    collisionBeginHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        if (gameObjectA._collision) Object.keys(gameObjectA._collision).forEach(tag => {
            if (userDataB.tags.indexOf(tag) != -1) gameObjectA._collision[tag].add(gameObjectB._name);
        })
        if (gameObjectB._collision) Object.keys(gameObjectB._collision).forEach(tag => {
            if (userDataA.tags.indexOf(tag) != -1) gameObjectB._collision[tag].add(gameObjectA._name);
        })
    }

    collisionEndHandler(contact) {
        var userDataA = contact.getFixtureA().getBody().getUserData();
        var userDataB = contact.getFixtureB().getBody().getUserData();
        var gameObjectA = this.gameObjects.get(userDataA.name);
        var gameObjectB = this.gameObjects.get(userDataB.name);
        if (gameObjectA._collision) Object.keys(gameObjectA._collision).forEach(tag => {
            if (userDataB.tags.indexOf(tag) != -1) gameObjectA._collision[tag].delete(gameObjectB._name);
        })
        if (gameObjectB._collision) Object.keys(gameObjectB._collision).forEach(tag => {
            if (userDataA.tags.indexOf(tag) != -1) gameObjectB._collision[tag].delete(gameObjectA._name);
        })
    }
}
