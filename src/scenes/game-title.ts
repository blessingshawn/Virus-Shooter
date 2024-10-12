/// <reference path="../globals.ts"/>

import { WORLD_WIDTH, WORLD_HEIGHT } from "../constants";


export class GameTitleScene extends Phaser.Scene {

	preload(): void {

	}	

	create(): void {
		var x = WORLD_WIDTH / 2;
		var y = WORLD_HEIGHT / 2;
		var image = this.add.image(x, y, 'gametitle');
		image.setOrigin(0.5, 0.5);

		var textTitle = this.add.text(x - 150, 50, globalThis.gameData.gameName, { font: '72px Courier', fill: '#00ff00', fontstyle: 'bold'});
		var textVersion = this.add.text(x + 200, 100, 'version: ' + globalThis.gameData.gameVersion, { font: '24px Courier', fill: '#00ff00' });
		var textDeveloper = this.add.text(x - 150, 50, 'by: ' + globalThis.gameData.gameDeveloperName, { font: '40px Courier', fill: '#00ff00', fontstyle: 'bold'});
		var textPressButton = this.add.text(x - 200, WORLD_HEIGHT - 100, 'Press a button on the Gamepad to use', { font: '24px Courier', fill: '#00ff00' });

		textTitle.setPosition(x - textTitle.width / 2, 10 + textTitle.height / 2);
		textVersion.setPosition(x - textVersion.width / 2 + 160, 10 + textVersion.height / 2 + 80);
		textDeveloper.setPosition(textTitle.x, 10 + textDeveloper.height / 2 + 110);
		textPressButton.setPosition(x - textPressButton.width / 2, y + 350 + textTitle.height / 2);

		this.input.gamepad.once('down', (pad, button, index) => {
			globalThis.gpad = pad;
			this.scene.start('Main');
		}, this);

		var spaceKey = this.input.keyboard.addKey('SPACE');
		spaceKey.on('down', () => {
			//globalThis.gpad = null;
			this.scene.start('Main');
		}, this);
	}

}