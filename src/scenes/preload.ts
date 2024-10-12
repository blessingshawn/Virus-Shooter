/// <reference path="../globals.ts"/>

export class PreloadScene extends Phaser.Scene {

	preload(): void {

		this.load.crossOrigin = 'anonymous';
		this.load.maxParallelDownloads = Infinity;

		this.load.image('gametitle', 'assets/images/splash.png');
		this.load.image('ground', 'assets/sprites/platform.png');
		this.load.image('background', 'assets/images/nebula.png');
		this.load.image('blastRing', 'assets/images/blastRing.png');
		this.load.image('knighthawks', 'assets/fonts/knighthawks-font.png');
		this.load.image('smartbombsmall', 'assets/sprites/smartBombSmall.png');
		this.load.atlas('space', 'assets/spritesheets/space.png', 'assets/spritesheets/space.json');
		this.load.atlas('explosion', 'assets/spritesheets/space.png', 'assets/spritesheets/space.json');
		this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
		this.load.json('gameData', 'assets/gameData.json');

	}	

	create(): void {
		globalThis.gameData = this.cache.json.get('gameData');
		globalThis.playerLives = globalThis.gameData.player.lives;
		globalThis.playerBombs = globalThis.gameData.player.smartBombs;
		globalThis.currentLevelIndex = 0;
		globalThis.currentLevel = globalThis.gameData.levels[globalThis.currentLevelIndex];
		this.scene.start('GameTitle');
	}

}
