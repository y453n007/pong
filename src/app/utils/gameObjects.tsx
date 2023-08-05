
const PLAYER_HEIGHT = 80;
const PLAYER_WIDTH = 10;
const VELOCITYX = - 5;
const VELOCITYY = 5;

export class Ball {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	velocityX: number;
	velocityY: number;
	color: string;

  constructor(_x:number, _y:number, _s:number,) {
		this.x = _x / 2;
		this.y = _y / 2;
		this.width = 15;
		this.height = 15;
		this.speed = _s;
		this.velocityX = VELOCITYX;
		this.velocityY = VELOCITYY;
		this.color = "#EEEEEE";
  }
}

export class Net  {
	x: number;
	y: number;
	width: number;
	height: number;
	wallWidth: number;
	wallHeight: number;
	color: string;

	constructor(_x: number) {
		this.x = _x / 2 - 1;
		this.y = 0;
		this.width = 10;
		this.height = 10;
		this.wallWidth = _x - 20;
		this.wallHeight = 7;
		this.color = "#EEEEEE";
	}
}

export class Player  {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		score: number;

		constructor(_y: number) {
			this.x = 10;
			this.y = _y / 2 - PLAYER_HEIGHT / 2;
			this.width = PLAYER_WIDTH;
			this.height = PLAYER_HEIGHT;
			this.color = "#EEEEEE";
			this.score = 0;
  }
}

export class Bot {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	score: number;

	constructor(_x: number, _y: number) {
		this.x = _x - PLAYER_WIDTH - 10;
    this.y = _y / 2 - PLAYER_HEIGHT / 2,
		this.width = PLAYER_WIDTH;
		this.height = PLAYER_HEIGHT;
		this.color = "#EEEEEE";
		this.score = 0;
	}
}
