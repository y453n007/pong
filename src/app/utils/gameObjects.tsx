
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 20;

export class Ball {
	x: number;
	y: number;
	radius: number;
	speed: number;
	velocityX: number;
	velocityY: number;
	color: string;

  constructor(_x:number, _y:number, _s:number, _r:number) {
		this.x = _x / 2;
		this.y = _y / 2;
		this.radius = _r;
		this.speed = _s;
		this.velocityX = 5;
		this.velocityY = 5;
		this.color = "#DC5F00";
  }
}

export class Net  {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;

	constructor(_x: number) {
		this.x = _x / 2 - 1;
		this.y = 0;
		this.width = 2;
		this.height = 10;
		this.color = "#CF0A0A";
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
			this.color = "#DC5F00";
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
		this.color = "#DC5F00";
		this.score = 0;
	}
}
