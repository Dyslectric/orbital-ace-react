import { Container, Graphics, Sprite } from "@pixi/react";
import { BLEND_MODES, Texture } from "pixi.js";
import { useCallback, useContext, useEffect } from "react";
import { CameraContext } from "./Game";

export const CameraControlBox = ({x, y, width, height}) => {
    const { x: cameraX, y: cameraY, z, zoom } = useContext(CameraContext);

    const drawBgBox = useCallback((graphics) => {
        graphics.clear();
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
    });

    const drawCameraBox = useCallback((graphics) => {
        graphics.clear();
        graphics.beginFill(0x0000ff);
        graphics.drawRect(0, 0, width * (1 + z), height * (1 + z));
        graphics.endFill();
    });

    const mousedownMessage = useCallback((event) => {
        console.log("mousedown at: ", event.data.x - x, event.data.y - y);
    });

    const mousemoveMessage = useCallback((event) => {
        console.log("mousemove at: ", event.data.x - x, event.data.y - y);
    })

    return (
        <Container
            position={{x, y}}
            //width={width}
            //height={height}
            interactive={true}
            mousedown={mousedownMessage}
            mousemove={mousemoveMessage}
            anchor={0.5}
        >
            <Graphics
                draw={drawBgBox}
                //onmousedown={() => {console.log("mousedown")}}
            />
            {
            //<Sprite
            //    texture={Texture.WHITE}
            //    width={width * zoom}
            //    height={height * zoom}
            //    position={{x: width / 2, y: height / 2}}
            //    anchor={0.5}
            //    blendMode={BLEND_MODES.ADD}
            ///>
            }
            <Graphics
                draw={drawCameraBox}
                position={{x: width / 2 + (cameraX * zoom), y: height / 2 + (cameraY * zoom)}}
                anchor={0.5}
            />
        </Container>
    )
}