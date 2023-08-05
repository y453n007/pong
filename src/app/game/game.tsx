'use client'
import React, { useEffect } from 'react'
import * as Math from 'mathjs';
import { Ball, Net, Player, Bot } from '../utils/gameObjects'


//Game Var
const BOT_L = 0.5;
const SPEED = 1.5;
const DELTA_SPEED = 0.5;
const FPS = 60;
const BETA = 45;
const VELOCITYX = - 5;
const VELOCITYY = 5;
				// Draw shapes
/*Draw Rect*/
const drawRect = (x:number, y:number, w:number, h:number, color:string, ctx:CanvasRenderingContext2D) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

/*Draw Text*/
const drawScore = (text: any, x: number, y: number, color: string, ctx:CanvasRenderingContext2D) => {
	ctx.fillStyle = color;
	ctx.font = "48px Qahiri";
	ctx.fillText(text, x, y);
}

// Draw Net
const drawNet = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, net: Net) => {
    for (let i = 19; i <= canvas.height - 22; i+= 22) {
      drawRect(net.x, net.y + i, net.width, net.height, net.color, ctx);
    }

}

// Redraw Canvas
const  render = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, ball: Ball, net: Net, player: Player, bot: Bot)  => {
	drawRect(0, 0, canvas.width, canvas.height, "#000000", ctx);                         // THE TABLE
	drawNet(canvas, ctx, net);                                                           // THE MIDDLE LINE
	drawScore(player.score, (2/5) * canvas.width, canvas.height / 8, "#EEEEEE", ctx);    // LEFT SCORE
	drawScore(bot.score, (3/5) * canvas.width, canvas.height / 8, "#EEEEEE", ctx);       // RIGHT SCORE
	drawRect(player.x, player.y, player.width, player.height, player.color, ctx);        // THE PLAYER
	drawRect(bot.x, bot.y, bot.width, bot.height, bot.color, ctx);                       // THE BOT
	drawRect(ball.x, ball.y, ball.width, ball.height,ball.color, ctx);                   // THE BALL
	drawRect(10, 5, net.wallWidth, net.wallHeight, "#EEEEEE", ctx);                      // UP WALL 
	drawRect(10, canvas.height - 12, net.wallWidth, net.wallHeight, "#EEEEEE", ctx);     // DOWN WALL   
}

// Reset Ball
const resetBall = (canvas: HTMLCanvasElement, ball: Ball) => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = SPEED;
    ball.velocityX = VELOCITYX;
    ball.velocityY = VELOCITYY;
}

// Check Collision
const collision = (b: Ball, p: Bot | Player) => {
	// ball
    const b_top = b.y;
    const b_bottom = b.y + b.width;
    const b_left = b.x;
    const b_right = b.x + b.width;

    // player
    const p_top = p.y;
    const p_bottom = p.y + p.height;
    const p_left = p.x;
    const p_right = p.x + p.width;
    return (
      b_right > p_left && b_bottom > p_top && b_left < p_right && b_top < p_bottom
    );
}

// Count the bot pos
const lerp = (a: number, b: number, t: number) => {
	return (
		a + (b - a) * t
	);
}

const ballBounce = (b: Ball, p: Player | Bot) => {
	let relativeIntersectY = ((p.y + (p.height / 2)) - (b.y + (b.height / 2)));
	let normalIntersectY = relativeIntersectY / (p.height / 2);
	let beta = normalIntersectY * BETA;
	let pi = Math.pi;
	// convert the result to radian
  beta = beta * (pi / 180);
	let sign = Math.sign(b.velocityX);
	b.velocityX = Math.abs(Math.cos(beta)) * b.speed * (-sign);
	b.velocityY = - Math.sin(beta) * b.speed;
}


// update : pos, mov, score, ...
const update = (canvas:HTMLCanvasElement, player: Player, ball: Ball, bot: Bot) => {
	
	//ball mov
	ball.y += ball.velocityY;
	ball.x += ball.velocityX;
	console.log("X:  ", ball.velocityX);

	// ball hit wall
	if (ball.y + ball.height > canvas.height - 12 || ball.y  < 12) {
		ball.velocityY = - ball.velocityY;
	}

	// ball hit player
	let selectPlayer = ball.x < canvas.width / 2 ? player : bot;
	if (collision(ball, selectPlayer)) {
		ballBounce(ball, selectPlayer);
		ball.speed < 20 ? ball.speed += DELTA_SPEED : ball.speed;
	}
	
	// bot mov 
	let targetPos = ball.y - bot.height / 2;
	let currentPos = bot.y + ball.height / 2;
	bot.y = lerp(currentPos, targetPos, BOT_L)
	if (bot.y  < 12) {
		bot.y = 12;
	} else if (bot.y  > canvas.height - bot.height - 12) {
		bot.y = canvas.height - bot.height - 12;
	}
	// Score update
	if (ball.x - ball.width / 2 < 0) {
		bot.score++;
		resetBall(canvas, ball);
	} else if (ball.x + ball.width / 2 > canvas.width) {
		player.score++;
		resetBall(canvas, ball);
	}
}

const CanvasComponent = () => {
	useEffect(() => {
    const canvas = document.querySelector("#ping") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const player = new Player(canvas.height);
    const ball = new Ball(canvas.width , canvas.height, SPEED);
    const bot = new Bot(canvas.width, canvas.height);
    const net = new Net(canvas.width);
		// Mouse events listener
    canvas.addEventListener("mousemove", (e) => {
    	if (canvas) {
				if (e.clientY  >=  player.height / 2 + 12 && e.clientY  <= canvas.height - player.height / 2 - 12) {
					player.y = e.clientY - player.height / 2;
				} else if (e.clientY  <  player.height / 2 + 12 && e.clientY) {
					player.y = 12;
				} else if (e.clientY  > canvas.height - player.height / 2 - 12) {
					player.y = canvas.height - player.height - 12;
				}
      }
    })
    if (ctx ) {
			// Game logic
      const game = () => {
				render(canvas, ctx, ball, net, player, bot);
				update(canvas, player, ball, bot);
      };
			const intervalId = setInterval(game, 1000 / FPS );
      return () => {
        clearInterval(intervalId);
      }
		};
	}, []);
	return <canvas  id="ping" width="600" height="400"></canvas>;
};

export default CanvasComponent;