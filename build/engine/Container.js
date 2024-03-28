class Container {

    constructor(render,actor) {
        var actor = actor
        var container = new PIXI.Container();
        container.zIndex = actor.zIndex;
        // Add sprite
        container.sprite = new PIXI.TilingSprite();
        Container.updateSpriteTexture(container, actor.image, actor.tileX, actor.tileY);
        container.addChild(container.sprite);
        // Add sprite text
        const style = new PIXI.TextStyle({ wordWrap: true, wordWrapWidth: actor.width, padding: actor.width });
        container.spriteText = new PIXI.Text("", style);
        container.spriteText.anchor.set(0.5);
        container.spriteText.scale.y = -1;
        container.addChild(container.spriteText);
        // Add container
        render.stage.addChild(container);
        // Add Debug 
        container.debug = new PIXI.Graphics();
        render.stage.addChild(container.debug);
        return (container);
    }

    static updateSpriteTexture(container, image, tileX, tileY, flipX, flipY) {
        const existsImage = Boolean(player.loader.resources[image]);
        if (existsImage) container.sprite.texture = player.loader.resources[image].texture;
        else {
            container.sprite.texture = PIXI.Texture.WHITE;
            container.sprite.texture.orig = new PIXI.Rectangle(0, 0, 50, 50);
        }
        container.sprite.texture.rotate = 8;
        container.sprite.anchor.set(0.5);
        container.sprite.width = container.sprite.texture.width * tileX;
        container.sprite.height = container.sprite.texture.height * tileY;
        container.sprite.scale.x = (flipX) ? -math.abs(container.sprite.scale.x) : math.abs(container.sprite.scale.x);
        container.sprite.scale.y = (flipY) ? -math.abs(container.sprite.scale.y) : math.abs(container.sprite.scale.y);
    }

    static renderDebugLines(container, rigidbody, x, y, angle, collider, zIndex) {
        container.debug.clear();
        container.debug = Object.assign(container.debug, { x: x, y: y, angle: angle });
        container.debug.lineStyle(1, 0xFF2222, 1, 0.5);
        container.debug.zIndex = zIndex;
        var shape = rigidbody.getFixtureList().getShape();
        switch (collider) {
            case "Box": {
                container.debug.moveTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter);
                for (var v = 1; v < shape.m_count; v++) {
                    container.debug.lineTo(shape.getVertex(v).x * Physics.pixelsPerMeter, shape.getVertex(v).y * Physics.pixelsPerMeter);
                }
                container.debug.lineTo(shape.getVertex(0).x * Physics.pixelsPerMeter, shape.getVertex(0).y * Physics.pixelsPerMeter); break;
            }
            case "Circle": { container.debug.drawCircle(0, 0, shape.m_radius * Physics.pixelsPerMeter); break; }
        }
    }

    static updateScroll(scrollX, scrollY, sprite, deltaTime) {
        if (scrollX != 0) sprite.tilePosition.x += scrollX * deltaTime;
        if (scrollY != 0) sprite.tilePosition.y += scrollY * deltaTime;
    }

    static updateText(spriteText, scope, align, width, offsetX) {
        var decimals = 0;
        spriteText.text = math.print(spriteText.expression, scope, { notation: 'fixed', precision: decimals });
        switch (align) {
            case "Left": spriteText.position.x = (-width / 2 + spriteText.width / 2) + offsetX; break;
            case "Right": spriteText.position.x = (width / 2 - spriteText.width / 2) + offsetX; break;
        }
    }

}
