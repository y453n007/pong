import CanvasComponent from './game/game';
import '@/app/globals.css'

export default function Home() {
  return (
    <main >
        <div className="pong_borde">
          <CanvasComponent />
        </div>
    </main>
  )
}
