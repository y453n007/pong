'use client'
import React, { useEffect } from 'react'
import * as Math from 'mathjs';
import { Ball, Net, Player, Bot, Word, Button } from '../utils/gameObjects'


//Game Var
const BOT_L = 0.2;
const SPEED = 5;
const DELTA_SPEED = 0.5;
const FPS = 60;
const BETA = 45;
let SIDE = false;
let CLICK = false;
let STOP = false;

				// Draw shapes
/*Draw Rect*/
const drawRect = (x: number, y: number, w:number, h:number, color:string, ctx:CanvasRenderingContext2D) => {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, 25);
	ctx.fill();
}


// Draw Net
const drawNet = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, net: Net) => {
    for (let i = 25; i <= canvas.width - 22; i+= 20) {
      drawRect(net.x + i, net.y, net.width, net.height, net.color, ctx);
    }

}

const drawWord = (word: Word, color: string, font: string, ctx:CanvasRenderingContext2D) => {
	ctx.fillStyle = color;
	ctx.font =  word.height + "px " +  `'${font}'`;
	const per = ((6.94 * word.height)/100);
	ctx.fillText(word.word, word.x + per , word.y + word.height + per);
}

// Redraw Canvas
const  render = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, ball: Ball, net: Net, player: Player, bot: Bot)  => {
	
	
	
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	let length = player.score.toString().length;
	const botScore = new Word(canvas.width + (64 * length) / 2, canvas.height - canvas.height / 4, ("" + bot.score), 64, length);
	const playerScore = new Word(canvas.width + (64 * length) / 2, canvas.height + (1/7) * canvas.height, ("" + player.score), 64, length);

	drawRect(0, 0, canvas.width, canvas.height, "#064469", ctx);                         // THE TABLE
	drawNet(canvas, ctx, net);     					                                             // THE MIDDLE LINE

	drawWord(playerScore, "#D0D7E1", 'Handjet', ctx);
	drawWord(botScore, "#D0D7E1", 'Handjet', ctx);

	drawRect(player.x, player.y, player.width, player.height, player.color, ctx);        // THE PLAYER
	drawRect(bot.x, bot.y, bot.width, bot.height, bot.color, ctx);                       // THE BOT

	drawRect(ball.x + ( -ball.velocityX * 2.5), ball.y + ( -ball.velocityY * 2.5), ball.width, ball.height, "#D1D3E0", ctx);
	drawRect(ball.x + 1 + ( -ball.velocityX * 5), ball.y + 1 + ( -ball.velocityY * 5), ball.width - 2, ball.height - 2, "#D1D3E0", ctx);
	drawRect(ball.x, ball.y, ball.width, ball.height,ball.color, ctx);                   // THE BALL


	drawRect(10, 10, net.wallWidth, net.wallHeight, "#072D44", ctx);                      // RIGHT WALL 
	drawRect(canvas.width - net.wallWidth - 10, 10, net.wallWidth, net.wallHeight, "#072D44", ctx);     // LEFT WALL   
}

// Reset Ball
const resetBall = (canvas: HTMLCanvasElement, ball: Ball) => {
	ball.x = Math.floor((Math.random() * 400) + 20)
	ball.x > 420 ? ball.x = 420 : ball.x
	ball.y = (canvas.height + ball.height) / 2;
	ball.speed = SPEED;
	ball.velocityX = ((Math.floor((Math.random() * 5) + 1)) / 10) * ball.speed;
	ball.velocityY = ((Math.floor((Math.random() * 5) + 1)) / 10) * ball.speed;
	(Math.floor((Math.random() * 2) + 1)) === 1? ball.velocityY : ball.velocityY = -ball.velocityY;
	(Math.floor((Math.random() * 2) + 1)) === 1? ball.velocityX : ball.velocityX = -ball.velocityX;
}

// Check Collision
const collision = (b: any, p: any) => {
	// ball
	b.top = b.y + b.velocityY;
	b.bottom = b.y + b.height + b.velocityY;
	b.left = b.x;
	b.right = b.x + b.width;
	
	// player
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;
	return (
		b.bottom > p.top && b.right > p.left && b.top < p.bottom && b.left < p.right
    );
	}
	
// Count the bot pos
const lerp = (a: number, b: number, t: number) => {
	return (
		a + (b - a) * t
		);
	}
		
const ballBounce = (b: Ball, p: Player | Bot) => {
	const hitPoint = ((p.x + (p.width / 2)) - (b.x));
	const intersectValue = (hitPoint / (p.width / 2));
	const beta = (intersectValue * BETA) * (Math.pi/ 180);
	const sign = Math.sign(b.velocityY);
	b.velocityX = -Math.sin(beta);
	b.velocityY = Math.cos(beta);
	if (SIDE)
		b.velocityY = -Math.cos(beta);
}



// update : pos, mov, score, ...
const update = (canvas:HTMLCanvasElement, player: Player, ball: Ball, bot: Bot) => {
	// ball hit wall
	if (ball.x + ball.width +2+ ball.velocityX > (canvas.width ) - 20 || ball.x +2+ ball.velocityX < 20) {
		ball.velocityX = -ball.velocityX;
	}
	ball.x += ball.velocityX * ball.speed;
	
	// ball hit player
	let selectPlayer = ball.y > canvas.height / 2 ? player : bot;
	SIDE = ball.y > canvas.height / 2 ? true : false;
	if (collision(ball, selectPlayer)) {
		ballBounce(ball, selectPlayer);
		ball.speed < 20 ? ball.speed += DELTA_SPEED : ball.speed;
	}
	ball.y += ball.velocityY * ball.speed;
	
	// bot mov 
	let targetPos = ball.x - bot.width / 2;
	let currentPos = bot.x + ball.width / 2;
	bot.x = lerp(currentPos, targetPos, BOT_L)
	if (bot.x  < 20)
		bot.x = 20;
	else if (bot.x  > canvas.width - bot.width - 20)
		bot.x = canvas.width - bot.width - 20;
	// Score update
	if (ball.y + ball.height > canvas.height) {
		bot.score++;
		resetBall(canvas, ball);
	} else if (ball.y  + player.height / 2 < 10) {
		player.score++;
		resetBall(canvas, ball);
	}
}

const replayOrQuit = (canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D) => {

	const replayButton = new Button((((1/2) * canvas.width) - 156) / 2 ,(canvas.height - 26 ) / 2, 156, 26);
	const replayWord = new Word((1/2) * canvas.width, canvas.height, "REPLAY", 26, 6);
	const per = ((40 * 26)/100)
	drawRect(replayWord.x - per / 2, replayWord.y - per / 2, replayWord.width + per, replayWord.height + per, "#9CCDDB", ctx);
	drawWord(replayWord, "#064469", 'Press Start 2P', ctx);

	const quitButton = new Button(((canvas.width + (1/2) * canvas.width) - (104)) / 2, (canvas.height - 104) / 2, 104, 26);
	const quitWord = new Word(canvas.width + (1/2) * canvas.width, canvas.height, "QUIT", 26, 4);
	drawRect(quitWord.x - per / 2, quitWord.y - per / 2, quitWord.width + per, quitWord.height + per, "#9CCDDB", ctx);
	drawWord(quitWord, "#064469", 'Press Start 2P', ctx);
}

const CanvasComponent = () => {
	const handleClick= () => {
		CLICK === true? CLICK = false : CLICK = true;
	}
	useEffect(() => {
		const canvas = document.querySelector("#ping") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const player = new Player(canvas.width, canvas.height);
    const ball = new Ball(canvas.width , canvas.height, SPEED);
    const bot = new Bot(canvas.width, canvas.height);
    const net = new Net(canvas.height);
		// Mouse events listener
	// 	canvas.addEventListener("click", (e) => {
	// 		let rect = canvas.getBoundingClientRect();
	// 		let x = e.clientX - rect.left;
	// 		let y = e.clientY - rect.top;;
			
	// 		// buttons.forEach(b => {
	// 		// 	if (b.inBounds(x, y) && !!b.onClick) b.onClick();
  // // });
	// 	});
    canvas.addEventListener("mousemove", (e) => {
			if (canvas) {
				let rect = canvas.getBoundingClientRect();
				if (e.clientX - rect.left >=  player.width / 2 + 20 && e.clientX - rect.left <= canvas.width - player.width / 2 - 20) {
					player.x = e.clientX - rect.left - player.width / 2;
				} else if (e.clientX - rect.left  <  player.width / 2 + 20 && e.clientX - rect.left) {
					player.x = 20;
				} else if (e.clientX - rect.left > canvas.width - player.width / 2 - 20) {
					player.x = canvas.width - player.width - 20;
				}
      }
    })
    if (ctx ) {
			// Game logic
      const game = () => {
				if (!STOP) {
					if (!CLICK) {
						update(canvas, player, ball, bot);
						render(canvas, ctx, ball, net, player, bot);
					} else {
						const word = new Word(canvas.width, canvas.height, "PONG", 64, 4);
						const per = ((40 * 32)/100)
						drawRect(word.x - per / 2, word.y - per / 2, word.width, word.height, "#9CCDDB", ctx);
						drawWord(word, "#064469", 'Press Start 2P', ctx);
					} 
				}
				if (bot.score === 10) {
					const word = new Word(canvas.width, canvas.height/2, "BOT WON", 32, 7);
					const per = ((40 * 32)/100)
					drawRect(word.x - per / 2, word.y - per / 2, word.width + per, word.height + per, "#9CCDDB", ctx);
					drawWord(word, "#064469", 'Press Start 2P', ctx);
					replayOrQuit(canvas, ctx);
					STOP = true;
				}
				if (player.score === 10) {
					const word = new Word(canvas.width, ((canvas.height * 2) - canvas.height / 2), "YOU WON", 32, 7);
					const per = ((40 * 32)/100)
					drawRect(word.x - per / 2, word.y - per / 2, word.width + per, word.height + per, "#9CCDDB", ctx);
					drawWord(word, "#064469", 'Press Start 2P', ctx);
					replayOrQuit(canvas, ctx);
					STOP  = true;
				}
      };
			const intervalId = setInterval(game, 1000 / FPS );
      return () => {
        clearInterval(intervalId);
      }
		};
	}, []);
	return (
		<canvas id="ping" width="400" height="600">
			
		</canvas>
	);
};

export default CanvasComponent;