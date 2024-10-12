/// <reference path="../globals.ts"/>

import { MainScene } from "../scenes/main";

export class GameNextLevel extends Phaser.Scene {

	preload(): void {

	}	

	create(): void {
        globalThis.currentLevelIndex += 1;
        globalThis.currentLevel = globalThis.gameData.levels[globalThis.currentLevelIndex];
        globalThis.playerBombs = globalThis.gameData.player.smartBombs;
		
		globalThis.gameScene.startNextLevel();
	}

}