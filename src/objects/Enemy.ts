/// <reference path="../globals.ts"/>

import { MainScene } from "../scenes/main";

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    private speed;
    private checkOutOfBounds;
    private target;
    private index;
    private score: number = 0;

    constructor(scene: Phaser.Scene) {

        super(scene, 0, 0, 'mine-sheet');
        
        this.index = Phaser.Math.Between(0, globalThis.currentLevel.enemyTypes.length -1);
        this.setDepth(1);
        this.speed = globalThis.currentLevel.enemyTypes[this.index].speed;
        this.score = globalThis.currentLevel.enemyTypes[this.index].scoreValue;
        this.checkOutOfBounds = false;
        this.target = new Phaser.Math.Vector2();
    
    }

    launch(): void {

    this.play('mine-anim');
    this.checkOutOfBounds = false;
    var p = Phaser.Geom.Rectangle.RandomOutside(globalThis.spaceOuter, globalThis.spaceInner);
    globalThis.spaceInner.getRandomPoint(this.target);
    //var ranScale = Phaser.Math.Between(1, globalThis.currentLevel.enemyTypes.length);
    this.setScale(globalThis.currentLevel.enemyTypes[this.index].scale, globalThis.currentLevel.enemyTypes[this.index].scale);
    this.speed = globalThis.currentLevel.enemyTypes[this.index].speed;
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(p.x, p.y);
    this.body.reset(p.x, p.y);
    var angle = Phaser.Math.Angle.BetweenPoints(p, this.target);
    this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

    }

    update(time, delta): void {
        var withinGame = globalThis.spaceInner.contains(this.x, this.y);

        if (!this.checkOutOfBounds && withinGame)
        {
            this.checkOutOfBounds = true;
        }
        else if (this.checkOutOfBounds && !withinGame)
        {
            this.kill();
        }
    }

    kill(): void {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
        
        globalThis.gameScene.launchEnemy();
    }

}