'use client'
import React, { useEffect } from 'react'
import { Ball, Net, Player, Bot } from '../utils/gameObjects'


//Game Var
const BOT_L = 0.5;
const SPEED = 0.2;
const DELTA_SPEED = 0.2;
const FPS = 60;

																// Draw shapes
/*Draw Rect*/
const drawRect = (x:number, y:number, w:number, h:number, color:string, ctx:CanvasRenderingContext2D) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

/*Draw Text*/
export const drawScore = (text: any, x: number, y: number, color: string, ctx:CanvasRenderingContext2D) => {
	ctx.fillStyle = color;
	ctx.font = "48px Qahiri";
	ctx.fillText(text, x, y);
}

// Draw Net
export const drawNet = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, net: Net) => {
    for (let i = 19; i <= canvas.height - 22; i+= 22) {
      drawRect(net.x, net.y + i, net.width, net.height, net.color, ctx);
    }

}

// Redraw Canvas
export const  render = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, ball: Ball, net: Net, player: Player, bot: Bot)  => {
	drawRect(0, 0, canvas.width, canvas.height, "#000000", ctx);                         // THE TABLE
	drawNet(canvas, ctx, net);                                                           // THE MIDDLE LINE
	drawScore(player.score, (2/5) * canvas.width, canvas.height / 5, "#EEEEEE", ctx);    // LEFT SCORE
	drawScore(bot.score, (3/5) * canvas.width, canvas.height / 5, "#EEEEEE", ctx);       // RIGHT SCORE
	drawRect(player.x, player.y, player.width, player.height, player.color, ctx);        // THE PLAYER
	drawRect(bot.x, bot.y, bot.width, bot.height, bot.color, ctx);                       // THE BOT
	drawRect(ball.x, ball.y, ball.width, ball.hieght,ball.color, ctx);                   // THE BALL
	drawRect(10, 5, net.wallWidth, net.wallHieght, "#EEEEEE", ctx);                      // UP WALL 
	drawRect(10, canvas.height - 12, net.wallWidth, net.wallHieght, "#EEEEEE", ctx);     // DOWN WALL   
}

// Reset Ball
export const resetBall = (canvas: HTMLCanvasElement, ball: Ball) => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = SPEED;
    ball.velocityX = - ball.velocityX;
}

// Check Collision
export const collision = (b: any, p: any) => {
	// ball
	b.top = b.y ;
	b.bottom = b.y + p.width / 2;
	b.left = b.x - p.width / 2;
	b.right = b.x + b.width / 2;

	// player
	p.top = p.y - b.width / 2;
	p.bottom = p.y + p.height;
	p.left = p.x 
	p.right = p.x + p.width;

	return (
		b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
	);
}

// Count the bot pos
const lerp = (a: number, b: number, t: number) => {
	return (
		a + (b - a) * t
	);
}

// update : pos, mov, score, ...
const update = (canvas:HTMLCanvasElement, player: Player, ball: Ball, bot: Bot) => {
	//ball mov
	ball.y += ball.velocityY * ball.speed;
	ball.x += ball.velocityX * ball.speed;

	// ball hit wall
	if (ball.y + ball.width / 2 > canvas.height - 17 || ball.y - 12 < 0) {
		ball.velocityY = -ball.velocityY
	}

	// ball hit player
	let selectPlayer = ball.x < canvas.width / 2 ? player : bot;
	if (collision(ball, selectPlayer)) {
			ball.velocityY = -ball.velocityY
			ball.velocityX = -ball.velocityX;
			if (ball.speed < 15.5) {ball.speed += DELTA_SPEED;}
	}
	
	// bot mov 
	let targetPos = ball.y - bot.height / 2;
	let currentPos = bot.y + ball.hieght / 2;
	bot.y = lerp(currentPos, targetPos, BOT_L)

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
  // const canvas:any = useRef(null);
	useEffect(() => {
    const canvas = document.querySelector("#ping") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const player = new Player(canvas.height);
    const ball = new Ball(canvas.width , canvas.height, SPEED);
    const bot = new Bot(canvas.width, canvas.height);
    const net = new Net(canvas.width);
    canvas.addEventListener("mousemove", (e) => {
      if (canvas) {
        let rect = canvas.getBoundingClientRect();
        player.y = e.clientY - rect.top - player.height / 2;
      }
    })
    if (ctx ) {
      const game = () => {
          // Game logic
        update(canvas, player, ball, bot);
        render(canvas, ctx, ball, net, player, bot);
      };
      
			const intervalId = setInterval(game, 1000 / FPS);

      return () => {
        clearInterval(intervalId);
      }
		};
	}, []);
	return <canvas  id="ping" width="600" height="400"></canvas>;
};

export default CanvasComponent;