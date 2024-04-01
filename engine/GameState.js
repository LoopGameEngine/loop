class GameState {

    constructor(engine) {
        this._engine = engine;
        this._music = new Sound(engine.gameModel.soundtrack);
        // Add game properties
        Object.keys(engine.gameModel.allProperties).forEach(property => {
            this["_" + property] = engine.gameModel.allProperties[property];
        });
        Object.assign(this, engine.gameModel.allProperties);
    }

    // Render properties
    get displayWidth() { return this._displayWidth };
    set displayWidth(value) {
        this._displayWidth = Input.width = value;
        this._engine.render.renderer.resize(value, this.displayHeight);
        this._engine.render.stage.hitArea = new PIXI.Rectangle(-Input.width / 2, -Input.height / 2, Input.width, Input.height);
    }

    get displayHeight() { return this._displayHeight };
    set displayHeight(value) {
        this._displayHeight = Input.height = value;
        this._engine.render.renderer.resize(this.displayWidth, value);
        this._engine.render.stage.hitArea = new PIXI.Rectangle(-Input.width / 2, -Input.height / 2, Input.width, Input.height);
    }

    get cameraX() { return this._cameraX };
    set cameraX(value) {
        this._cameraX = value;
        this._engine.render.stage.x = this.displayWidth / 2.0 - value;
        this._engine.render.stage.hitArea.x = -this._engine.render.stage.x;
    }

    get cameraY() { return this._cameraY }
    set cameraY(value) {
        this._cameraY = value;
        this._engine.render.stage.y = this.displayHeight / 2.0 + value;
        this._engine.render.stage.hitArea.y = -this._engine.render.stage.y;
    }

    get cameraAngle() { return this._cameraAngle }
    set cameraAngle(value) { this._cameraAngle = value; this._engine.render.stage.angle = value }

    get cameraZoom() { return this._cameraZoom }
    set cameraZoom(value) { this._cameraZoom = value; this._engine.render.stage.scale = { x: value, y: -value } }

    get backgroundColor() { return this._backgroundColor }
    set backgroundColor(value) { this._backgroundColor = value; this._engine.render.renderer.backgroundColor = PIXI.utils.string2hex(value); }

    // Sound properties
    get soundOn() { return this._soundOn }
    set soundOn(value) {
        if (value != this._sound) {
            if (this._music.source) this._music.source.mute(!value, this._music.id);
            this._engine.gameObjects.forEach(gameObject => {
                if (gameObject.audio.source) gameObject.audio.source.mute(!value, gameObject.audio.id)
            })
            this._soundOn = value;
        }
    }

    get soundtrack() { return this._soundtrack }
    set soundtrack(value) {
        if (value != this.soundtrack) {
            if (this._music.source) this._music.source.stop(this._music.id);
            this._music = new Sound(value, { volume: this.volume, loop: this.loop, pan: this.pan, start: this.start });
            if (this._music.source) this._music.source.mute(!this.soundOn, this._music.id);
            this._soundtrack = value;
        }
    }

    get volume() { return this._volume };
    set volume(value) { this._volume = value; if (this._music.source) this._music.source.volume(value) }

    get start() { return this._start };
    set start(value) { this._start = value; if (this._music.source) this._music.source.seek(value) }

    get pan() { return this._pan };
    set pan(value) { this._pan = value; if (this._music.source) this._music.source.stereo(value) }

    get loop() { return this._loop }
    set loop(value) { this._loop = value; if (this._music.source) this._music.source.loop(value); }

    // Physic properties
    get physicsOn() { return this._physicsOn }
    set physicsOn(value) {
        if (value != this._physicsOn) {
            this._engine.gameObjects.forEach(gameObject => {
                if (value && gameObject.physicsOn) Rigidbody.convertToRigidbody(gameObject);
                else Rigidbody.convertToSensor(gameObject);
            })
            this._physicsOn = value;
        }
    }

    get gravityX() { return this._gravityX }
    set gravityX(value) { this._gravityX = value; this._engine.physics.world.setGravity(planck.Vec2(value, this.gravityY)); }

    get gravityY() { return this._gravityY }
    set gravityY(value) { this._gravityY = value; this._engine.physics.world.setGravity(planck.Vec2(this.gravityX, value)) }

    // // Input properties
    get FPS() { return 1 / this._engine.frameTime }
    set FPS(value) { this._engine.frameTime = 1 / value }

    get time() { return this._engine.time }
    set time(value) { this._engine.time = value }

    get deltaTime() { return this._engine.deltaTime }
    set deltaTime(value) { this._engine.deltaTime = value }

    get mouseX() { return Input.pointerX }
    set mouseX(value) { Input.pointerX = value }

    get mouseY() { return Input.pointerY }
    set mouseY(value) { Input.pointerY = value }

    get currentScene() { return this._currentScene }
    set currentScene(value) {
        if (this._engine.gameState) {
            this._currentScene = value;
            this._currentSceneNumber = this._engine.gameModel.sceneList.indexOf(this._engine.sceneList[value]);
            this._engine.gameObjects.forEach(gameObject => gameObject.remove());
            this._engine.loadScene(value);
        }
    }

    get currentSceneNumber() { return this._currentSceneNumber }
    set currentSceneNumber(value) {
        if (this._engine.gameState) {
            this._currentSceneNumber = value;
            this._engine.currentScene = this._engine.gameModel.sceneList[value].name;
        }
    }
}