import { Bullet } from "./objects/Bullet";
import { Enemy } from "./objects/Enemy";

//var gpad: any = null;

var gameData: any = null;
var levelData: any = null;

var ship: any = null;
var smartBomb: any = null;
var playerLives: number = 0;
var PlayerBombs: number = 0;
var currentLevel: any = null;
var currentLevelIndex: number = 0;

var bullets: Array<Bullet> = new Array<Bullet>();
var enemies: Array<Enemy> = new Array<Enemy>();
var lastfired: number = 0;
var fire: any = null;
var xparticles: any = null;
var spaceInner: Phaser.Geom.Rectangle = null;
var spaceOuter: Phaser.Geom.Rectangle = null;

var gameScene: Phaser.Scene = null;