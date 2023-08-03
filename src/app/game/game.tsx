'use client'
import React, { useEffect } from 'react'
import { Ball, Net, Player, Bot } from '../utils/gameObjects'


//Game Var
const BOT_L = 1;
const SPEED = 0.2;
const DELTA_SPEED = 0.1;
const FPS = 60;


// Draw shapes
/*Draw Rect*/
const drawRect = (x:number, y:number, w:number, h:number, color:string, ctx:CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

/*Draw Circle*/
export const drawCircle = (x: number, y: number, r: number, color: string, ctx:CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

/*Draw Text*/
export const drawScore = (text: any, x: number, y: number, color: string, ctx:CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.font = "32px '60s Scoreboard'";
    ctx.fillText(text, x, y);
}

// Draw Net
export const drawNet = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, net: Net) => {
    for (let i = 0; i <= canvas.height; i+= 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color, ctx);
    }

}

// Redraw Canvas
export const  render = (canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D, ball: Ball, net: Net, player: Player, bot: Bot)  => {
  // console.log("render", canvas)
    drawRect(0, 0, canvas.width, canvas.height, "#EEEEEE", ctx);                         // THE TABLE
    drawNet(canvas, ctx, net);                                                           // THE MIDDLE LINE
    drawScore(player.score, canvas.width / 4, canvas.height / 5, "#CF0A0A", ctx);        // LEFT SCORE
    drawScore(bot.score, (3 * canvas.width) / 4, canvas.height / 5, "#CF0A0A", ctx);     // RIGHT SCORE
    drawRect(player.x, player.y, player.width, player.height, player.color, ctx);        // THE PLAYER
    drawRect(bot.x, bot.y, bot.width, bot.height, bot.color, ctx);                       // THE BOT
    drawCircle(ball.x, ball.y, ball.radius, ball.color, ctx);                            // THE BALL
}

// Reset Ball
export const resetBall = (canvas: HTMLCanvasElement, ball: Ball) => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = SPEED;
    ball.velocityX = -ball.velocityX;
}

// Check Collision
export const collision = (b: any, p: any) => {
    // ball
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    // player
    p.top = p.y ;
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
    ball.x += ball.velocityX * ball.speed;
    ball.y += ball.velocityY * ball.speed;

    // ball collision 
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY
    }

    // ball hit player
    let selectPlayer = ball.x < canvas.width / 2 ? player : bot;
    if (collision(ball, selectPlayer)) {
        ball.velocityX = -ball.velocityX;
        ball.speed += DELTA_SPEED;
    }
    
    // bot mov 
    let targetPos = ball.y;
    let currentPos = bot.y;
    // bot.y = targetPos - bot.height / 2;
    bot.y = lerp(currentPos, targetPos, BOT_L)

    // Score update
    if (ball.x - ball.radius < 0) {
        bot.score++;
        resetBall(canvas, ball);
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall(canvas, ball);
    }
}

const CanvasComponent = () => {
  // const canvas:any = useRef(null);
	useEffect(() => {
    const canvas = document.querySelector("#ping") as HTMLCanvasElement;
    console.log("canvas", canvas.height)
    const ctx = canvas.getContext("2d");
    const player = new Player(canvas.height);
    const ball = new Ball(canvas.width , canvas.height, 0.5, 10);
    const bot = new Bot(canvas.width, canvas.height);
    const net = new Net(canvas.width);
    canvas.addEventListener("mousemove", (e:any) => {
      if (canvas) {
        let rect = canvas.getBoundingClientRect();
        player.y = e.clientY - rect.top - player.height / 2;
      }
      console.log("test")
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