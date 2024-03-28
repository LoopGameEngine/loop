class GameObject {

    constructor(engine, actor, spawned) {
        this._engine = engine;
        this._actor = actor;
        this._spawned = spawned;
        this._name = (spawned) ? actor.name + Utils.id() : actor.name;
        // Add gameObject to the engines
        this._container = new Container(engine.render, actor);
        this._rigidbody = new Rigidbody(engine.physics, actor, this._name);
        this._audio = new Sound(actor.sound);
        this._timer = this._collision = {};
        this._rule = new Rule(this, actor.scriptList, this._name, this._timer, this._collision);
        // Add actor properties to gameObject
        Object.keys(actor.properties).forEach(property => {
            this["_" + property] = actor.properties[property];
        });
        this._physicsOn = this._width = this._height = this._scaleX = this._scaleY = undefined;
        Object.assign(this, actor.allProperties);
        // Add gameObject to scope and gameObject list in the engine
        engine.gameObjects.set(this._name, this);
        engine.scope[this._name] = this;
    }

    remove() {
        this._engine.render.stage.removeChild(this._container);
        this._engine.render.stage.removeChild(this._container.debug);
        this._engine.physics.world.destroyBody(this._rigidbody);
        if (this._audio.source) this._audio.source.stop(this._audio.id);
        delete Input.touchObjects[this._name];
        delete this["rule"];
        this._engine.gameObjects.delete(this._name);
        delete this._engine.scope[this._name];
    }

    fixedStep() { // physics update
        this.x = this._rigidbody.getPosition().x * Physics.pixelsPerMeter;
        this.y = this._rigidbody.getPosition().y * Physics.pixelsPerMeter;
        this.angle = Utils.degrees(this._rigidbody.getAngle());
    }

    fixedUpdate(deltaTime) { // logic update
        if (this._spawned) this._spawned = false;
        else if (!this.sleeping) {
            if (this._rule) try { this._rule.eval(this._engine.scope) } catch (error) { console.log(this._name, error) }    // update logic
            if (this.spriteOn) Container.updateScroll(this.scrollX, this.scrollY, this._container.sprite, deltaTime);
            if (this.textOn) Container.updateText(this._container.spriteText, this._engine.scope, this.align, this.width, this.offsetX);
            if (this._dead) this.remove();
        }
    }

    update() { // render update
        if (this.screen) {  // render screen gameObject
            this.x = this._originalX + this._engine.gameState.cameraX;
            this.y = this._originalY + this._engine.gameState.cameraY;
        }
        if (this._engine.gameState.debug) // render debug lines
            Container.renderDebugLines(this._container, this._rigidbody, this.x, this.y, this.angle, this.collider, this._actor.zIndex);
    }

    // access to GameObject properties
    get sleeping() { return this._sleeping }
    set sleeping(value) { this._rigidbody.setActive(!value); this._sleeping = value; }

    // Settings
    get x() { return this._x }
    set x(value) {
        this._x = this._container.x = value;
        this._rigidbody.setPosition(planck.Vec2(value * Physics.metersPerPixel, this._rigidbody.getPosition().y));
    }

    get y() { return this._y }
    set y(value) {
        this._y = this._container.y = value;
        this._rigidbody.setPosition(planck.Vec2(this._rigidbody.getPosition().x, value * Physics.metersPerPixel));
    }

    get width() { return this._width }
    set width(value) { // sprite.width = sprite.texture.width * tileX;  this.width = sprite.width * sprite.scale.x 
        if (value != this._width) {
            this._width = value;
            this._container.sprite.scale.x = Math.sign(this._container.sprite.scale.x) * value / this._container.sprite.width;
        }
    }

    get height() { return this._height }
    set height(value) {
        if (value != this._height) {
            this._height = value;
            this._container.sprite.scale.y = Math.sign(this._container.sprite.scale.y) * value / this._container.sprite.height;
        }
    }

    get scaleX() { return this._scaleX }
    set scaleX(value) {
        if (value != this._scaleX) {
            this._scaleX = value;
            this._container.sprite.scale.x = value * Math.sign(this._container.sprite.scale.x);
            this.width = this._container.sprite.width * this._container.sprite.scale.x; // update widht to update collider
        }
    }

    get scaleY() { return this._scaleY }
    set scaleY(value) {
        if (value != this._scaleY) {
            this._scaleY = value;
            this._container.sprite.scale.y = value * Math.sign(this._container.sprite.scale.y);
            this.height = this._container.sprite.height * this._container.sprite.scale.y; // update height to update collider
        }
    }

    get angle() { return this._angle }
    set angle(value) {
        this._angle = this._container.angle = value;
        this._rigidbody.setAngle(Utils.radians(value));
    }

    get screen() { return this._screen }
    set screen(value) {
        this._screen = value;
        this._originalX = this.x;
        this._originalY = this.y;
    }

    get collider() { return this._collider }
    set collider(value) {
        this._collider = value;
        var fixture = this._rigidbody.getFixtureList();
        if (fixture) this._rigidbody.destroyFixture(fixture);
        var collisionShape;
        switch (value) {
            case "Circle":
                var diameter = (this.width > this.height) ? this.width : this.height;
                collisionShape = planck.Circle(diameter / 2 * Physics.metersPerPixel); break;
            default:
                collisionShape = planck.Box(this.width / 2 * Physics.metersPerPixel, this.height / 2 * Physics.metersPerPixel);
        }
        this._rigidbody.createFixture({ density: 1, shape: collisionShape });
    }

    get tags() { return this._tags }
    set tags(value) { this._tags = value }

    // Sprite
    get spriteOn() { return this._spriteOn }
    set spriteOn(value) { this._spriteOn = this._container.sprite.visible = value }

    get image() { return this._image }
    set image(value) {
        if (this._image != value) {
            this._image = value;
            Container.updateSpriteTexture(this._container, value, this.tileX, this.tileY, this.flipX, this.flipY);
        }
    }

    get key() { return this._key }
    set key(value) {
        if (this._secuence) {
            if (value >= this._secuence.length) value = 0;
            else if (value < 0) value = this._secuence.length - 1;
            this.image = this._secuence[value];
            this._key = value;
        }
    }

    get color() { return this._color }
    set color(value) { this._color = value; this._container.sprite.tint = PIXI.utils.string2hex(value) }

    get opacity() { return this._opacity }
    set opacity(value) { this._opacity = this._container.sprite.alpha = value }

    get flipX() { return this._flipX }
    set flipX(value) {
        this._flipX = value;
        this._container.sprite.scale.x = (value) ? -math.abs(this._container.sprite.scale.x) : math.abs(this._container.sprite.scale.x);
    }

    get flipY() { return this._flipY }
    set flipY(value) { this._flipY = value; this._container.sprite.scale.y *= (value) ? -1 : 1 }

    get scrollX() { return this._scrollX }
    set scrollX(value) { this._scrollX = value }

    get scrollY() { return this._scrollY }
    set scrollY(value) { this._scrollY = value }

    get tileX() { return this._tileX }
    set tileX(value) { this._tileX = value }

    get tileY() { return this._tileY }
    set tileY(value) { this._tileY = value }

    // Text
    get textOn() { return this._textOn }
    set textOn(value) { this._textOn = this._container.spriteText.visible = value }

    get text() { return this._text }
    set text(value) {
        this._text = value;
        var textExpression = value.replace(/Me./g, this._name + "."); // chage Me by actor's name
        textExpression = textExpression.replace(/{/g, "").replace(/}/g, ""); // delete { and }
        this._container.spriteText.expression = textExpression;
    }

    get font() { return this._font }
    set font(value) { this._font = this._container.spriteText.style.fontFamily = value }

    get size() { return this._size }
    set size(value) { this._size = this._container.spriteText.style.fontSize = value }

    get fill() { return this._fill }
    set fill(value) { this._fill = this._container.spriteText.style.fill = value }

    get style() { return this._style }
    set style(value) { this._style = this._container.spriteText.style.fontStyle = value }

    get align() { return this._align }
    set align(value) { this._align = value; this._container.spriteText.style.align = value.toLowerCase() }

    get offsetX() { return this._offsetX }
    set offsetX(value) {
        this._offsetX = value;
    }

    get offsetY() { return this._offsetY }
    set offsetY(value) { this._offsetY = this._container.spriteText.position.y = value }

    // Sound
    get soundOn() { return this._soundOn }
    set soundOn(value) {
        if (value && this._audio.source) this._audio.source.play(this._audio.id);
        else if (this._audio.source) this._audio.source.stop(this._audio.id);
        this._soundOn = value;
    }

    get sound() { return this._sound }
    set sound(value) {
        if (value != this._sound) {
            if (this._audio.source) this._audio.source.stop(this._audio.id);
            this._audio = new Sound(value, { volume: this.volume, loop: this.loop, pan: this.pan, start: this.start });
            if (this.soundOn)
                if (this._audio.source) this._audio.source.play(this._audio.id);
                else if (this._audio.source) this._audio.source.stop(this._audio.id);
        }
        this._sound = value;
    }

    get volume() { return this._volume }
    set volume(value) { this._volume = value; if (this._audio.source) this._audio.source.volume(value) }

    get start() { return this._start }
    set start(value) { this._start = value; if (this._audio.source) this._audio.source.seek(value) }

    get pan() { return this._pan }
    set pan(value) { this._pan = value; if (this._audio.source) this._audio.source.stereo(value) }

    get loop() { return this._loop }
    set loop(value) { this._loop = value; if (this._audio.source) this._audio.source.loop(value) }

    // Physics
    get physicsOn() { return this._physicsOn }
    set physicsOn(value) {
        if (value != this._physicsOn) {
            (this._engine.gameState.physicsOn && value) ? Rigidbody.convertToRigidbody(this) : Rigidbody.convertToSensor(this);
            this._physicsOn = value;
        }
    }

    get type() { return this._type.toLowerCase() }
    set type(value) {
        if (value != this._type) {
            this._type = value;
            (this._engine.gameState.physicsOn && this.physicsOn) ? Rigidbody.convertToRigidbody(this) : Rigidbody.convertToSensor(this);
        }
    }

    get fixedAngle() { return this._fixedAngle }
    set fixedAngle(value) { this._fixedAngle = value; this._rigidbody.setFixedRotation(value) }

    get velocityX() { return this._rigidbody.getLinearVelocity().x * Physics.pixelsPerMeter }
    set velocityX(value) {
        (this._engine.gameState.physicsOn && this.physicsOn) ?
            this._rigidbody.setLinearVelocity(planck.Vec2(value * Physics.metersPerPixel, this._rigidbody.getLinearVelocity().y)) : 0;
    }

    get velocityY() { return this._rigidbody.getLinearVelocity().y * Physics.pixelsPerMeter }
    set velocityY(value) {
        (this._engine.gameState.physicsOn && this.physicsOn) ?
            this._rigidbody.setLinearVelocity(planck.Vec2(this._rigidbody.getLinearVelocity().x, value * Physics.metersPerPixel)) : 0;
    }

    get angularVelocity() { return Utils.degrees(this._rigidbody.getAngularVelocity()) }
    set angularVelocity(value) {
        (this._engine.gameState.physicsOn && this.physicsOn) ?
            this._rigidbody.setAngularVelocity(Utils.radians(value)) : 0;
    }

    get density() { return this._density }
    set density(value) { this._density = value; this._rigidbody.getFixtureList().setDensity(value) }

    get friction() { return this._friction }
    set friction(value) { this._friction = value; this._rigidbody.getFixtureList().setFriction(value) }

    get restitution() { return this._restitution }
    set restitution(value) { this._restitution = value; this._rigidbody.getFixtureList().setRestitution(value) }

    get dampingLinear() { return this._dampingLinear }
    set dampingLinear(value) { this._dampingLinear = value; this._rigidbody.setLinearDamping(value) }

    get dampingAngular() { return this._dampingAngular }
    set dampingAngular(value) { this._dampingAngular = value; this._rigidbody.setAngularDamping(value) }

}
