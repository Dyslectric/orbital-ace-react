import { useTick } from "@pixi/react";
import { SpaceBackground } from "./SpaceBackground";
import { createContext, useContext, useEffect, useState } from "react";
import { CameraControlBox } from "./CameraControlBox";
import { ViewportContext } from "./Viewport";
import { Slider } from "./Slider";

let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;
let scrollUp = false;
let scrollDown = false;

// x and y are from -1 to 1
// z is perspective distance
// zoom is how the final picture scales
export const CameraContext = createContext({ x: 0, y: 0, z: 0, zoom: 1 });

export const Game = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);
    const [zoom, setZoom] = useState(1);
    const { width, height } = useContext(ViewportContext);

    useEffect(() => {
        window.addEventListener("wheel", (event) => {
            if (event.deltaY > 0) {
                scrollDown = true;
            } else if (event.deltaY < 0) {
                scrollUp = true;
            }
        });
        window.addEventListener("keydown", (event) => {
            if (event.key.toUpperCase() == "W") {
                moveUp = true;
            }
            if (event.key.toUpperCase() == "S") {
                moveDown = true;
            }
            if (event.key.toUpperCase() == "A") {
                moveLeft = true;
            }
            if (event.key.toUpperCase() == "D") {
                moveRight = true;
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.key.toUpperCase() == "W") {
                moveUp = false;
            }
            if (event.key.toUpperCase() == "S") {
                moveDown = false;
            }
            if (event.key.toUpperCase() == "A") {
                moveLeft = false;
            }
            if (event.key.toUpperCase() == "D") {
                moveRight = false;
            }
        });
    }, []);

    useTick(() => {
        const movementSpeed = 1;
        if (moveUp) {
            setY(y - 1 * movementSpeed);
        }
        if (moveDown) {
            setY(y + 1 * movementSpeed);
        }
        if (moveLeft) {
            setX(x - 1 * movementSpeed);
        }
        if (moveRight) {
            setX(x + 1 * movementSpeed);
        }
        if (scrollDown) {
            setZ(z + 0.3);
            scrollDown = false;
        }
        if (scrollUp) {
            setZ(z - 0.3);
            scrollUp = false;
        }
    });

    return (
        <>
            <CameraContext.Provider value={{ x, y, z, zoom }}>
                <SpaceBackground />
                <CameraControlBox x={width - 300} y={height - 300} width={300} height={300} />
                <Slider
                    x={30}
                    y={30}
                    boxWidth={500}
                    boxHeight={30}
                    boxColor={0x202040}
                    barSize={100}
                    barPadding={8}
                    barColor={0xb040b0}
                    min={-2}
                    max={-12}
                    steps={100}
                    orientation={'horizontal'}
                    setValue={setZ}
                    currentValue={z}
                />
            </CameraContext.Provider>
        </>
    );
};
