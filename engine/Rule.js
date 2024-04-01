class Rule {

    constructor(gameObject, scriptList, name, timer, collision) {
        this.gameObject = gameObject;
        this.gameObjectName = name;
        this._timer = timer;
        this._collision = collision;
        var expression = new String();
        scriptList.forEach((script, i) => { // add scripts to expression
            expression += this.parseNodeList(script.nodeList) + ";";
        });
        expression = expression.replace(/Me\./g, name + "."); // replace Me by actor's name
        return (math.compile(expression));
    }

    parseNodeList(nodeList) {
        var secuence = [];
        if (nodeList.length > 0) {
            nodeList.forEach(node => {
                secuence += this[node.type.toLowerCase()](node.parameters, node.nodeListTrue, node.nodeListFalse) + ";"; // call node function
            })
            secuence = "[" + secuence.replace(/.$/, "]"); // replace last ; by ];
        }
        else secuence = "[]"; // empty nodeList
        return (secuence);
    }

    // Actions 
    edit(params) {
        var position = params.property.indexOf(".") + 1;
        var property = params.property.substring(position);
        var specialProperties = ["tags", "type", "color", "backgroundColor", "fill", "image", "sound", "soundtrack", "font", "style", "align", "collider", "currentScene"];
        if (specialProperties.includes(property) && params.value[0] != "'") params.value = "'" + params.value + "'"; // to add quotes if it doesn't have them
        return (params.property + " = " + params.value);
    }

    spawn(params) {
        return ("Engine.spawn(" + this.gameObjectName + "," + params.actor + "," + params.x + "," + params.y + "," + params.angle + ")");
    }

    delete() {
        return ("Engine.delete(" + this.gameObjectName + ")");
    }

    animate(params) {
        var id = Utils.id();
        this._timer[id] = new Object({ "time": 0.0, "previousTime": 0.0, "seconds": 1 });
        return ("Engine.animate(" + this.gameObjectName + ",'" + id + "','" + params.animation + "'," + params.fps + ")"); s
    }

    play(params) {
        return ("Engine.play(" + this.gameObjectName + ",'" + params.sound_File + "')");
    }

    move(params) {
        return ("Engine.move(" + this.gameObjectName + "," + params.speed + "," + params.angle + ")");
    }

    move_to(params) {
        return ("Engine.moveTo(" + this.gameObjectName + "," + params.speed + "," + params.x + "," + params.y + ")");
    }

    rotate(params) {
        return ("Engine.rotate(" + this.gameObjectName + "," + params.speed + "," + params.pivot_X + "," + params.pivot_Y + ")");
    }

    rotate_to(params) {
        return ("Engine.rotateTo(" + this.gameObjectName + "," + params.speed + "," + params.x + "," + params.y + "," + params.pivot_X + "," + params.pivot_Y + ")");
    }

    push(params) {
        return ("Engine.push(" + this.gameObjectName + "," + params.force + "," + params.angle + ")");
    }

    push_to(params) {
        return ("Engine.pushTo(" + this.gameObjectName + "," + params.force + "," + params.x + "," + params.y + ")");
    }

    torque(params) {
        return ("Engine.torque(" + this.gameObjectName + "," + params.angle + ")");
    }

    // Conditions
    compare(params, nodeListTrue, nodeListFalse) {
        var dictionary = { "Less": "<", "Less Equal": "<=", "Equal": "==", "Greater Equal": ">=", "Greater": ">", "Different": "!=" };
        var operation = dictionary[params.operation];
        return ("[" + params.value_1 + " " + operation + " " + params.value_2 + " ? " +
            this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    check(params, nodeListTrue, nodeListFalse) {
        return ("[" + params.property + " ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    collision(params, nodeListTrue, nodeListFalse) {
        var tags = params.tags.split(",");
        if (!this.gameObject._collision) this.gameObject._collision = {};
        tags.forEach(tag => {
            if (!this.gameObject._collision[tag]) this.gameObject._collision[tag] = new Set();
        })
        return ("[Engine.collision(" + this.gameObjectName + ",'" + params.tags + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    timer(params, nodeListTrue, nodeListFalse) {
        var id = Utils.id();
        this._timer[id] = new Object({ "time": 0.0, "previousTime": 0.0, "seconds": params.seconds });
        return ("[Engine.timer(" + this.gameObjectName + ",'" + id + "','" +  params.seconds + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    touch(params, nodeListTrue, nodeListFalse) {
        if (params.mode == "Is Over") params.mode = "Over";
        if (params.on_Actor) Input.addActor(this.gameObject);
        return ("[Engine.touch('" + params.mode.toLowerCase() + "'," + params.on_Actor + "," + this.gameObjectName + ") ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }

    keyboard(params, nodeListTrue, nodeListFalse) {
        Input.addKey(params.key);
        return ("[Engine.keyboard('" + params.key + "','" + params.key_Mode.toLowerCase() + "') ? " + this.parseNodeList(nodeListTrue) + " : " + this.parseNodeList(nodeListFalse) + "]");
    }
}

