class Input {
    static keyList = new Object();
    static touchObjects = new Object();
    static pointer = { down: false, up: true, over: false, tap: false };
    static firstTime = true;
    static pointerX = 0;
    static pointerY = 0;

    constructor(stage) {
        stage.on("pointerdown", Input.pointerDownHandler.bind(this));
        stage.on("pointerupoutside", Input.pointerUpHandler.bind(this));
        stage.on("pointerup", Input.pointerUpHandler.bind(this));
        stage.on("pointermove", Input.pointerMoveHandler.bind(this));
        if (Input.firstTime) { // Key events are only added once
            document.addEventListener("keydown", Input.keyDownHandler.bind(this));
            document.addEventListener("keyup", Input.keyUpHandler.bind(this));
            Input.firstTime = false;
        }
    }

    static restartInput() {
        for (let key in Input.keyList) {
            Input.keyList[key].down = false;
        }
        for (let gameObject in Input.touchObjects) {
            if (Input.touchObjects[gameObject._name]) Input.touchObjects[gameObject._name].tap = false;
        }
        if (Input.poienter) Input.pointer.tap = false;
    }

    static addKey(key) {
        if (!this.keyList.hasOwnProperty(key)) this.keyList[key] = { down: false, up: true, pressed: false };
    }

    static addActor(gameObject) { // add touchable gameObject
        if (!this.touchObjects.hasOwnProperty(gameObject.name)) this.touchObjects[gameObject._name] = { down: false, up: false, over: false, tap: false };
        gameObject._container.interactive = true;
        gameObject._container.buttonMode = true;
        // GameObject pointer events
        gameObject._container.on("pointerdown", this.actorPointerDownHandler.bind(this, gameObject._name));
        gameObject._container.on("pointerupoutside", this.actorPointerUpHandler.bind(this, gameObject._name));
        gameObject._container.on("pointerup", this.actorPointerUpHandler.bind(this, gameObject._name));
        gameObject._container.on("pointerover", this.actorPointerOverHandler.bind(this, gameObject._name));
        gameObject._container.on("pointerout", this.actorPointerOutHandler.bind(this, gameObject._name));
    }
    // Handlers
    static actorPointerDownHandler(name) {
        Input.touchObjects[name] = { down: true, up: false, over: true, tap: true };
    }

    static actorPointerUpHandler(name) {
        Input.touchObjects[name] = { down: false, up: true, over: true, tap: false };
    }

    static actorPointerOverHandler(name) {
        Input.touchObjects[name].over = true;
        Input.touchObjects[name].up = true;
    }

    static actorPointerOutHandler(name) {
        Input.touchObjects[name].over = false;
        Input.touchObjects[name].up = false;
    }

    static pointerDownHandler() {
        Input.pointer = { down: true, up: false, tap: true };
    }

    static pointerUpHandler() {
        Input.pointer = { down: false, up: true, tap: false };
    }

    static pointerMoveHandler(event) {
        var x = event.data.global.x - (Input.width / 2);
        var y = (Input.height / 2) - event.data.global.y;
        Input.pointerX = (x > Input.width / 2) ? Input.width / 2 : (x < -Input.width / 2) ? -Input.width / 2 : x;
        Input.pointerY = (y > Input.height / 2) ? Input.height / 2 : (y < -Input.height / 2) ? -Input.height / 2 : y;
    }

    static keyDownHandler(event) {
        event.preventDefault();
        if (Input.keyList.hasOwnProperty(event.code))
            Input.keyList[event.code] = { down: !Input.keyList[event.code].pressed, up: false, pressed: true };
    }

    static keyUpHandler(event) {
        event.preventDefault();
        if (Input.keyList.hasOwnProperty(event.code))
            Input.keyList[event.code] = { down: false, up: true, pressed: false };
    }
}
