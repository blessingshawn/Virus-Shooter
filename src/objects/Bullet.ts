/// <reference path="../globals.ts"/>

export class Bullet extends Phaser.Physics.Arcade.Image {

    private speed;
    private lifespan;
    private _temp;

    constructor(scene: Phaser.Scene) {

        super(scene, 0, 0, 'space', 'blaster');
        
        this.setBlendMode(1);
        this.setDepth(1);
        this.speed = 800;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
    
    }

    fire(ship): void {

        this.lifespan = 1000;

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(ship.body.rotation);
        this.setPosition(ship.x, ship.y);

        this.body.reset(ship.x, ship.y);

        this.body.setSize(10, 10, true);

        var angle = Phaser.Math.DegToRad(ship.body.rotation);

        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;

    }
    
    update(time, delta): void {
        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.kill();
        }
    }

    kill(): void {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
    }

}