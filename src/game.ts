/// <reference path="./phaser.d.ts"/>

import 'phaser';
import { BootScene } from './scenes/boot';
import { PreloadScene } from './scenes/preload';
import { GameTitleScene } from './scenes/game-title';
import { MainScene } from './scenes/main';
import { GameOverScene } from './scenes/game-over';
import { GameNextLevel } from './scenes/game-nextlevel';

import { WORLD_WIDTH, WORLD_HEIGHT } from './constants';

import { Plugins } from '@capacitor/core';

const config: Phaser.Types.Core.GameConfig = {
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#000000',
  //pixelArt: false,
  zoom: 1,
  input: {
    gamepad: true
  },
  physics: {
    default: "arcade",
    arcade: {
        debug: false,
        fps: 60,
        gravity: { y: 0 }
    }
  },
    //  Open the Dev Tools
    //  The version of your game appears after the title in the banner
    title: 'Virus Shooter',
    version: '0.5a'
};

export class Game extends Phaser.Game {

  constructor(config) {

    super(config);
    
    this.scene.add('Boot', BootScene, false);
    this.scene.add('Preload', PreloadScene, false);
    this.scene.add('GameTitle', GameTitleScene, false);
    this.scene.add('Main', MainScene, false);
    this.scene.add('GameOver', GameOverScene, false);
    this.scene.add('GameNextLevel', GameNextLevel, false);

    this.scene.start('Boot');

  }

}

new Game(config);