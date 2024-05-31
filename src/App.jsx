import { Stage } from "@pixi/react"
import { Viewport } from "./components/Viewport"
import { Game } from "./components/Game"

export const App = () => {
  return (
    <Stage options={{autoDensity: true, backgroundColor: 0x000000}}>
      <Viewport>
        <Game />
      </Viewport>
    </Stage>
  )
}
