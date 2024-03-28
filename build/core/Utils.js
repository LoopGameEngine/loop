class Utils {

    static id() {
        return "_" + new Date().valueOf() + Math.random().toFixed(16).substring(2);
    }

    static newName(name, list) {
        var strings = name.split("_");
        if (!isNaN(strings[strings.length - 1]) && strings[strings.length - 2] == "copy") {
            name = "";
            for (var i = 0; i < strings.length - 1; i++) name = name + strings[i] + "_";
            name = name.substring(0, name.length - 1);
        }
        else if (strings[strings.length - 1] != "copy") name = name + "_copy";
        var newName;
        var firstCopy = Boolean(list.findIndex(i => i.name == name) == -1);
        if (firstCopy) newName = name;
        else {
            var copyCounter = 2;
            newName = name + "_" + copyCounter;
            while (list && list.findIndex(i => i.name == newName) != -1) {
                copyCounter++;
                newName = name + "_" + copyCounter;
            }
        }
        return newName;
    }

    static rotatePoint(p, angle) {
        angle = Utils.radians(angle);
        var newX = p.x * Math.cos(angle) - p.y * Math.sin(angle);
        var newY = p.x * Math.sin(angle) + p.y * Math.cos(angle);
        return { x: newX, y: newY }
    }

    static radians(degrees) {
        return degrees * Math.PI / 180;
    }

    static degrees(radians) {
        return radians * 180 / Math.PI;
    }

    static getAngle(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    static getDistance(p1, p2) {
        return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }
}