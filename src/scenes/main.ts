/// <reference path="../globals.ts"/>

import Player from '../objects/player';
import { Bullet } from '../objects/Bullet';
import { Enemy } from '../objects/Enemy';
import { WORLD_WIDTH, WORLD_HEIGHT, zeroPad } from '../constants';
import { World } from 'matter';

export class MainScene extends Phaser.Scene {

	// private player;
	// private platforms;
	private gameStart: boolean = false;
	private joy: any = null;
	private score: number = 0;
	private stringScore: string = "0000000000";
	private textScore: any = null;
	private textLives: any = null;
	private textBombs: any = null;
	private textLevelNumber: any = null;
	private textLevelName: any = null;
	private useBomb: boolean = false;
	private currentEnemyCount: number = 0;
	private arrSmartBombs:Phaser.GameObjects.Image[] = new Array(3);

	preload(): void {
	}

	create(): void {
		this.currentEnemyCount = globalThis.currentLevel.totalEnemies ;

		globalThis.gameScene = this;
		globalThis.spaceOuter = new Phaser.Geom.Rectangle(-200, -200, WORLD_WIDTH + 200, WORLD_HEIGHT + 200);
		globalThis.spaceInner = new Phaser.Geom.Rectangle(0, 0, WORLD_WIDTH - 20, WORLD_HEIGHT - 20);
	
		this.textures.addSpriteSheetFromAtlas('mine-sheet', { atlas: 'space', frame: 'mine', frameWidth: 64 });
		this.anims.create({ key: 'mine-anim', frames: this.anims.generateFrameNumbers('mine-sheet', { start: 0, end: 15 }), frameRate: 20, repeat: -1 });
	
		this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 'background');
		this.add.image(200, 200, 'space', 'purple-planet').setOrigin(0);

		globalThis.ship = this.physics.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'space', 'ship').setDepth(2);
		globalThis.smartBomb = this.physics.add.image(globalThis.ship.x, globalThis.ship.y, 'blastRing').setScale(0.1).setVisible(false).setActive(false);
	
		globalThis.ship.setDamping(globalThis.gameData.player.shipDamping);
		globalThis.ship.setDrag(globalThis.gameData.player.shipDrag);
		globalThis.ship.setMaxVelocity(globalThis.gameData.player.shipMaxVelocity);

		globalThis.bullets = this.physics.add.group({
			classType: Bullet,
			maxSize: 30,
			runChildUpdate: true
		});
		
		globalThis.enemies = this.physics.add.group({
			classType: Enemy,
			maxSize: 60,
			runChildUpdate: true
		});
	
		globalThis.xparticles = this.add.particles('explosion');
	
		globalThis.xparticles.createEmitter({
			frame: 'red',
			angle: { min: 0, max: 360, steps: 32 },
			lifespan: 1000,
			speed: 400,
			quantity: 32,
			scale: { start: 0.3, end: 0 },
			on: false
		});
	
		globalThis.xparticles.createEmitter({
			frame: 'muzzleflash2',
			lifespan: 200,
			scale: { start: 2, end: 0 },
			rotate: { start: 0, end: 180 },
			on: false
		});
	
		var particles = this.add.particles('space');
	
		var emitter = particles.createEmitter({
			frame: 'blue',
			speed: 200,
			lifespan: (() =>
				{
					return Phaser.Math.Percent(globalThis.ship.body.speed, 0, 400) * 2000;
				}),

			alpha: (() =>
				{
					return Phaser.Math.Percent(globalThis.ship.body.speed, 0, 400);
				}),

			angle: (() =>
				{
					// var v = Phaser.Math.Between(-10, 10);
					var v = 0;
					return (globalThis.ship.angle - 180) + v;
				}),

			scale: { start: 0.6, end: 0 },
			blendMode: 'ADD'
		});

		emitter.startFollow(globalThis.ship);
	
		this.physics.add.overlap(globalThis.bullets, globalThis.enemies, this.hitEnemy, this.checkBulletVsEnemy, this);
		this.physics.add.overlap(globalThis.smartBomb, globalThis.enemies, this.hitBombEnemy, this.checkSmartBombVsEnemy, this);		
	
		for (var i = 0; i < globalThis.currentLevel.enemiesAtOnce; i++)
		{
			this.launchEnemy();
		}

		this.input.gamepad.once('down', (pad, button, index) => {
			this.joy = pad;
			//this.joy = globalThis.gpad;
			this.gameStart = true;
		}, this);

		this.input.gamepad.on('up', (pad, button, index) => {
			if (button.index == 0 && !this.useBomb) {this.useBomb = true; this.useSmartBomb();}
		}, this);

		//Score display
		this.textScore = this.add.bitmapText(0,50, 'atari', this.stringScore, 128);
		this.textScore.setBlendMode(Phaser.BlendModes.ADD);
		this.textScore.setDepth(10);
		this.textScore.alpha = 0.5;
		//LevelNumber display
		this.textLevelNumber = this.add.bitmapText(800,50, 'atari', 'Level ' + globalThis.currentLevel.number.toString(), 32);
		this.textLevelNumber.setBlendMode(Phaser.BlendModes.ADD);
		this.textLevelNumber.setDepth(10);
		this.textLevelNumber.alpha = 0.5;
		this.textLevelNumber.setPosition(WORLD_WIDTH / 2 - this.textLevelNumber.width / 2, 50);
		//LevelName display
		this.textLevelName = this.add.bitmapText(800,50, 'atari', globalThis.currentLevel.name, 32);
		this.textLevelName.setBlendMode(Phaser.BlendModes.ADD);
		this.textLevelName.setDepth(10);
		this.textLevelName.alpha = 0.5;
		this.textLevelName.setPosition(WORLD_WIDTH / 2 - this.textLevelNumber.width / 2, 100);
		//Lives display
		this.textLives = this.add.bitmapText(800,50, 'atari', 'Lives: ' + globalThis.playerLives.toString(), 32);
		this.textLives.setBlendMode(Phaser.BlendModes.ADD);
		this.textLives.setDepth(10);
		this.textLives.alpha = 0.5;
		this.textLives.setPosition(WORLD_WIDTH - this.textLives.width, 50);

		let smartbombwidth: number = 40;
		let x1: number = 0;
		for (let i = 0; i < globalThis.playerBombs; i++)
		{
			x1 = WORLD_WIDTH - smartbombwidth * (i + 1);
			this.arrSmartBombs[i] =  this.add.image(x1, 100, 'smartbombsmall', 'purple-planet').setOrigin(0);
		}
		let fontconfig: any  = {
			image: 'knighthawks',
			width: 32,
			height: 25,
        chars: Phaser.GameObjects.RetroFont.TEXT_SET2,
        charsPerRow: 10
		};
		let textBombsLabel: any = null;
		this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, fontconfig));
		textBombsLabel = this.add.bitmapText(800, 100, 'knighthawks', 'SMARTBOMB:');
		textBombsLabel.setScale(0.5);
		textBombsLabel.setPosition(x1 - textBombsLabel.width, 100);


		this.displaySmartBombs();

	}

	update(time): void {
		if (!this.gameStart) { return; }

		this.textLives.text = "Lives: " + globalThis.playerLives.toString();
		//this.textBombs.text = "Smart Bombs: " + globalThis.playerBombs.toString();

		if (this.joy.axes.length)
		{
			var axisH = this.joy.axes[0].getValue();
			var axisV = this.joy.axes[1].getValue();

			globalThis.ship.x += 4 * axisH;
			globalThis.ship.y += 4 * axisV;
			globalThis.smartBomb.setPosition(globalThis.ship.x, globalThis.ship.y);
		}

		if ((this.joy.rightStick.x != 0) || (this.joy.rightStick.y != 0))
		{
			var angle = Math.atan2(this.joy.rightStick.y, this.joy.rightStick.x) * 180 / Math.PI;
			globalThis.ship.angle = angle;
			globalThis.smartBomb.angle = angle;
		}

		if ((this.joy.rightStick.x <= -0.25 || this.joy.rightStick.x >= 0.25) 
		|| (this.joy.rightStick.y <= -0.25 || this.joy.rightStick.y >= 0.25))
		{
			var bullet = globalThis.bullets.get();
			if (bullet)
			{
				bullet.fire(globalThis.ship);

				globalThis.lastFired = time + 100;
			}
		}

		this.physics.world.wrap(globalThis.ship, 32);

		if (this.currentEnemyCount <= 0) {
			this.scene.start('GameNextLevel');
		}
	}

	gameOver(): void {
		this.scene.start('GameOver');
	}

	launchEnemy(): void {
		if (this.currentEnemyCount <= globalThis.currentLevel.totalEnemies)
		{
			var b = globalThis.enemies.get();

			if (b)
			{
				b.launch();
			}
		}
	}

	startNextLevel(): void {
		this.textures.removeKey('mine-sheet');
		this.anims.remove('mine-anim');
		this.currentEnemyCount = 0;
		this.scene.restart();
	}

	displaySmartBombs(): void {
		for (let i = 0; i < this.arrSmartBombs.length; i++)
		{
			if (i > globalThis.playerBombs)
			{
				console.log('bomb[]: ' + i.toString());
				this.arrSmartBombs[i].setVisible(false);
			}
		}
	}

	removeEnemy(enemy: Enemy): void {
		const objIndex = globalThis.enemies.children.entries.indexOf(enemy);
		if (objIndex > -1) {
			globalThis.enemies.children.entries.splice(objIndex, 1);
		}
	}

	checkBulletVsEnemy(bullet, enemy): void {
		return (bullet.active && enemy.active);
	}

	checkSmartBombVsEnemy(smartBomb, enemy): void {
		console.log('checkSmartBombVsEnemy');
		return (smartBomb.active && enemy.active);
	}

	useSmartBomb() {
		if (this.useBomb && globalThis.playerBombs > 0) 
		{ 
			globalThis.smartBomb.setVisible(true);
			globalThis.smartBomb.setActive(true);
	
			this.cameras.main.shake(1000, 0.005);

			this.tweens.add({
				targets: globalThis.smartBomb,
				scale: 4.0,
				ease: 'Linear',
				duration: 1000,
				onComplete: this.onsmartBombTweenComplete,
				onCompleteParams: [ globalThis.smartBomb ]
			});
			globalThis.playerBombs -= 1; 
			this.displaySmartBombs();
			this.useBomb = false; 
		}
	}

	onsmartBombTweenComplete(tween, target, smartBomb): void {
		smartBomb.setScale(0.1);
		smartBomb.setVisible(false);
		smartBomb.setActive(false);
	}

	hitShip(ship, enemy): void {
		globalThis.playerLives -= 1;
	}

	hitBombEnemy(smartBomb, enemy): void {
		console.log('hitBombEnemy');
		this.score += enemy.score;
		this.stringScore = zeroPad(this.score, 9);
		this.textScore.text = this.stringScore;
		enemy.kill();
		this.currentEnemyCount -= 1;
	}

	hitEnemy(bullet, enemy): void {

		this.score += enemy.score;
		// if (enemy.scale == 1) { this.score += 10000; }
		// if (enemy.scale == 2) { this.score += 5000; }
		// if (enemy.scale == 3) { this.score += 1000; }		
		// if (enemy.scale == 4) { this.score += 100; }

		console.log('this.score: ' + this.score.toString());
		this.stringScore = zeroPad(this.score, 9);
		console.log('this.stringScore: ' + this.stringScore);
		this.textScore.text = this.stringScore;
		console.log('textScore.text: ' + this.textScore.text);

    	//globalThis.xparticles.emitParticleAt(enemy.x, enemy.y);

		//this.cameras.main.shake(500, 0.005);

		bullet.kill();
		enemy.kill();

		//this.removeEnemy(enemy);
		this.currentEnemyCount -= 1;
	}

}
