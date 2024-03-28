class Rigidbody {

    constructor(physics, actor, gameObjectName) {
        var actor = actor;
        var rigidbody = physics.world.createBody({ userData: { name: gameObjectName, tags: actor.tags } });
        rigidbody._currentPhysics = {
            physicsOn: actor.physicsOn,
            type: actor.type.toLowerCase(),
            velocityX: actor.velocityX,
            velocityY: actor.velocityY,
            angularVelocity: actor.angularVelocity
        }
        return (rigidbody);
    }

    static convertToSensor(gameObject) {
        gameObject._rigidbody._currentPhysics = { // save current physic properties
            type: gameObject._rigidbody.m_type,
            velocityX: gameObject._rigidbody.getLinearVelocity().x,
            velocityY: gameObject._rigidbody.getLinearVelocity().y,
            angularVelocity: gameObject._rigidbody.getAngularVelocity()
        }
        gameObject._rigidbody.setDynamic();
        gameObject._rigidbody.getFixtureList().setSensor(true);
        gameObject._rigidbody.setGravityScale(0);
        gameObject.velocityX = gameObject.velocityY = gameObject.angularVelocity = 0;
    }

    static convertToRigidbody(gameObject) {
        switch (gameObject.type) {
            case "dynamic": gameObject._rigidbody.setDynamic(); break;
            case "kinematic": gameObject._rigidbody.setKinematic(); break;
            case "static": gameObject._rigidbody.setStatic(); break;
        }
        gameObject._rigidbody.getFixtureList().setSensor(false);
        gameObject._rigidbody.setGravityScale(1);
        gameObject.velocityX = gameObject._rigidbody._currentPhysics.velocityX;
        gameObject.velocityY = gameObject._rigidbody._currentPhysics.velocityY;
        gameObject.angularVelocity = gameObject._rigidbody._currentPhysics.angularVelocity;
    }
}
