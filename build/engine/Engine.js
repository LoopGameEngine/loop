class Engine {

    constructor(gameModel) {
        this.gameModel = gameModel;
        // Define debug mode (boolean property that can defined as game property in the editor to show collision shapes)
        this.debug = gameModel.debug || false;
        // Gameloop properties
        this.ffps = 100;
        this.deltaTime = 1 / this.ffps;
        this.currentTime = this.accumulator = this.frameTime = this.time = 0.0;
        // Create engines
        this.gameObjects = new Map();
        this.render = new Render(this.gameObjects);
        this.physics = new Physics(this.gameObjects);
        this.logic = new Logic(this.gameObjects);
        this.input = new Input(this.render.stage);
        // Engine properties
        this.sceneList = new Object();  // Create a new object to acces by name to the scenes in load and scope
        gameModel.sceneList.forEach(scene => { this.sceneList[scene.name] = scene });
        this.gameState = new GameState(this);
        this.scope = new Object({ "Game": this.gameState, "Engine": this });
        this.loadScene(this.gameState.currentScene);
        // Launch gameloop
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(newTime) {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        this.frameTime = (newTime - this.currentTime) / 1000;
        if (this.frameTime > 0.1) this.frameTime = 0.1;
        this.accumulator += this.frameTime;
        while (this.accumulator >= this.deltaTime) {
            this.physics.fixedStep(this.deltaTime);
            this.logic.fixedUpdate(this.deltaTime, this.scope);
            this.time += this.deltaTime;
            this.accumulator -= this.deltaTime;
        }
        this.render.update();
        this.currentTime = newTime;
    }

    loadScene(sceneName) {
        var zIndex = 0;
        Object.assign(this.gameState, this.gameModel.properties);
        this.sceneList[sceneName].actorList.forEach(actor => {
            actor.zIndex = zIndex;
            new GameObject(this, actor, false);
            zIndex++;
        });
    }

    // actions
    spawn(spawnerObject, gameObject, x, y, angle) {
        if (gameObject) { // spawn new gameObject if exists
            var sin = Math.sin(Utils.radians(spawnerObject.angle));
            var cos = Math.cos(Utils.radians(spawnerObject.angle));
            var spawnObject = new GameObject(this, gameObject._actor, true);
            spawnObject.x = spawnObject._originalX = spawnerObject.x + x * cos - y * sin;
            spawnObject.y = spawnObject._originalY = spawnerObject.y + x * sin + y * cos;
            spawnObject.angle = spawnerObject.angle + gameObject.angle + angle;
            spawnObject.sleeping = false;
            (this.gameState.physicsOn && spawnObject.physicsOn) ?
                Rigidbody.convertToRigidbody(spawnObject) : Rigidbody.convertToSensor(spawnObject);
        }
    }

    delete(gameObject) { gameObject._dead = true }

    animate(gameObject, id, animation, fps) {
        gameObject._timer[id].time += this.deltaTime;
        var dtAnim = 1 / fps;
        gameObject._secuence = animation.split(",");
        if (fps != 0) {
            gameObject.key = Math.floor((gameObject._timer[id].time / dtAnim) % gameObject._secuence.length);
        }
    }

    play(gameObject, sound) { new Sound(sound, { volume: gameObject.volume, loop: false }) }

    move(gameObject, speed, angle) {
        gameObject.x += speed * this.deltaTime * Math.cos(Utils.radians(angle));
        gameObject.y += speed * this.deltaTime * Math.sin(Utils.radians(angle));
    }

    moveTo(gameObject, speed, px, py) {
        var dist = Utils.getDistance({ x: gameObject.x, y: gameObject.y }, { x: px, y: py });
        gameObject.x = (dist > speed * this.deltaTime) ? gameObject.x + speed * this.deltaTime * (px - gameObject.x) / dist : px;
        gameObject.y = (dist > speed * this.deltaTime) ? gameObject.y + speed * this.deltaTime * (py - gameObject.y) / dist : py;
    }

    rotate(gameObject, speed, pivotX, pivotY) {
        var dist = Utils.getDistance({ x: pivotX, y: pivotY }, { x: gameObject.x, y: gameObject.y });
        gameObject.angle += speed * this.deltaTime;
        gameObject.x = pivotX + dist * Math.cos(Utils.radians(gameObject.angle));
        gameObject.y = pivotY + dist * Math.sin(Utils.radians(gameObject.angle));
    }

    rotateTo(gameObject, speed, x, y, pivotX, pivotY) {
        var dist = Utils.getDistance({ x: pivotX, y: pivotY }, { x: gameObject.x, y: gameObject.y });
        var d0 = { x: pivotX - gameObject.x, y: pivotY - gameObject.y };
        var angle0 = ((d0.x == 0) && (d0.y == 0)) ? Utils.radians(gameObject.angle) : Math.PI + Math.atan2(d0.y, d0.x); // angle between 0 and 2 PI
        var d1 = { x: pivotX - x, y: pivotY - y };
        var angle1 = Math.PI + Math.atan2(d1.y, d1.x); // angle between 0 and 2 PI
        var da = angle1 - angle0;
        da = (Math.abs(da) > Math.PI) ? (da < -Math.PI ? 2 * Math.PI + da : -2 * Math.PI + da) : da;
        gameObject.angle = (Utils.degrees(Math.abs(da)) > 0.5) ? gameObject.angle + speed * this.deltaTime : gameObject.angle;
        gameObject.x = pivotX + dist * Math.cos(Utils.radians(gameObject.angle));
        gameObject.y = pivotY + dist * Math.sin(Utils.radians(gameObject.angle));
    }

    push(gameObject, force, angle) {
        var forceX = force * Math.cos(Utils.radians(angle)) * Physics.pixelsPerMeter;
        var forceY = force * Math.sin(Utils.radians(angle)) * Physics.pixelsPerMeter;
        gameObject._rigidbody.applyForceToCenter(planck.Vec2(forceX, forceY));
    }

    pushTo(gameObject, force, x, y) {
        this.push(gameObject, force, Utils.degrees(Math.atan2(y - gameObject.y, x - gameObject.x)));
    }

    torque(gameObject, angle) {
        gameObject.rigidbody.applyTorque(Utils.radians(angle));
    }

    // conditions
    timer(gameObject, id, expression) {
        gameObject._timer[id].seconds = math.eval(expression, this.scope); // compute initial seconds
        var lostFlow = ((gameObject._timer[id].previousTime - gameObject._timer[id].time) > 0);
        var secReached = (gameObject._timer[id].time >= gameObject._timer[id].seconds);
        if (lostFlow || secReached) { // reset timer
            gameObject._timer[id].time = 0.0;
            gameObject._timer[id].previousTime = 0.0;
            return true;
        }
        else {
            gameObject._timer[id].time += this.deltaTime;
            gameObject._timer[id].previousTime = gameObject._timer[id].time;
            return false;
        }
    }

    collision(gameObject, tags) {
        var tagsToCollide = tags.split(",");
        var value = true;
        tagsToCollide.forEach(tag => { value &&= gameObject._collision[tag].size > 0 })
        return value;
    }

    keyboard(key, mode) { return Input.keyList[key][mode] }

    touch(mode, onActor, gameObject) {
        if (onActor) return Input.touchObjects[gameObject._name][mode]
        else return Input.pointer.tap;
    }
}
