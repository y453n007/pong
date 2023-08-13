
const PLAYER_HEIGHT = 20;
const PLAYER_WIDTH = 100;

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
		this.x = (_x - 20) / 2;
		this.y = (_y - 20) / 2;
		this.width = 20;
		this.height = 20;
		this.speed = _s;
		this.velocityX = 1;
		this.velocityY = 1;
		this.color = "#E2CFC9";
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

	constructor(_y: number) {
		this.x = 0;
		this.y = (_y - 15) / 2;
		this.width = 10;
		this.height = 10;
		this.wallWidth = 7;
		this.wallHeight = _y - 20;
		this.color = "#072D44";
	}
}

export class Player  {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		score: number;

		constructor(_x: number, _y: number) {
			this.x = _x / 2 - (PLAYER_WIDTH / 2);
			this.y = _y - PLAYER_HEIGHT - 10;
			this.width = PLAYER_WIDTH;
			this.height = PLAYER_HEIGHT;
			this.color = "#5790AB";
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
		this.x = _x / 2 - (PLAYER_WIDTH / 2);
    	this.y = 10;
		this.width = PLAYER_WIDTH;
		this.height = PLAYER_HEIGHT;
		this.color = "#5790AB";
		this.score = 0;
	}
}


export class Word {
	word: string;
	height: number;
	len: number;

	x: number;
	y: number;
	width: number;

	constructor(_x: number, _y: number, _w: string, _f: number, _l: number) {
		this.word = _w;
		this.height = _f;
		this.len = _l;

		this.x = (_x - (_l * _f)) / 2;
		this.y = ((_y - _f) / 2);
		this.width = _l * _f;

	}
}

export class Button {
		x: number;
		y: number;
		
		width: number;
		height: number;

	constructor(_x: number, _y: number, width: number, height: number) {
		this.x = _x;
		this.y = _y;
		this.width = width;
		this.height = height;
	}

	inBounds(mouseX: number, mouseY: number): boolean {
		return (
			mouseX > this.x || mouseX < this.x + this.width || mouseY > this.y || mouseY < this.y + this.height
		);
	}
}