import { MainScene } from "../scenes/main";

export class GameOverScene extends Phaser.Scene {

	preload(): void {

	}	

	create(): void {
		this.scene.start('GameTitle');
	}

}