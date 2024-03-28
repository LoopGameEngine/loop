class Actor {

    constructor(actor) {
        this.id = Utils.id();
        this.scriptList = [];
        this.key = 0;
        Object.assign(this, this.properties, actor); // add basic properties 
        if (this.scriptList) this.scriptList.forEach((script, i) => this.scriptList[i] = new Script(script));
    }

    get properties() {
        var obj = {
            // Settings
            sleeping: this.sleeping || false,
            x: this.x || 0, y: this.y || 0,
            width: this.width || 50, height: this.height || 50,
            scaleX: this.scaleX || 1, scaleY: this.scaleY || 1,
            angle: this.angle || 0, screen: this.screen || false,
            collider: this.collider || "Box", tags: this.tags || "",
            // Sprite
            spriteOn: this.spriteOn || false, image: this.image || "",
            key: 0,
            color: this.color || "#ffffff", opacity: this.opacity || 1,
            flipX: this.flipX || false, flipY: this.flipY || false,
            scrollX: this.scrollX || 0, scrollY: this.scrollY || 0,
            tileX: this.tileX || 1, tileY: this.tileY || 1,
            // // Text
            textOn: this.textOn || false, text: this.text || "",
            font: this.font || "Arial", size: this.size || 30,
            fill: this.fill || "#000000", style: this.style || "Normal",
            align: this.align || "Center", offsetX: this.offsetX || 0,
            offsetY: this.offsetY || 0,
            // // Sound
            soundOn: this.soundOn || false, sound: this.sound || "",
            start: this.start || 0, volume: this.volume || 1,
            pan: this.pan || 0, loop: this.loop || false,
            // // Physics
            physicsOn: this.physicsOn || false, type: this.type || "Dynamic",
            fixedAngle: this.fixedAngle || false,
            velocityX: this.velocityX || 0, velocityY: this.velocityY || 0,
            angularVelocity: this.angularVelocity || 0,
            density: this.density || 0, friction: this.friction || 0, restitution: this.restitution || 0,
            dampingLinear: this.dampingLinear || 0, dampingAngular: this.dampingAngular || 0
        }
        return (obj);
    }

    get newProperties() {
        var obj = Object.assign({}, this);
        Object.keys(this.properties).concat(["id", "name", "scriptList", "tags", "key", "zIndex"]).forEach(property => delete obj[property]);
        return (obj);
    }

    get allProperties() {
        var obj = Object.assign({}, this.properties, this.newProperties);
        return (obj);
    }

    addScript(script, pos) {
        this.scriptList.splice(pos, 0, script);
    }

    removeScript(scriptID) {
        this.scriptList.splice(this.scriptList.findIndex(i => i.id == scriptID), 1);
    }
}
