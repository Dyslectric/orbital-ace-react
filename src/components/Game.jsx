import { useTick } from "@pixi/react";
import { SpaceBackground } from "./SpaceBackground";
import { createContext, useEffect, useState } from "react";
//import { CameraControlBox } from "./CameraControlBox";
//import { ViewportContext } from "./Viewport";
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

    //let [i, setI] = useState(0);

    //useEffect(() => {
    //        setZoom(Math.sin(i) * 0.75 + 1.25);
    //        setZ(Math.cos(i) * 3.6 - 2.6);
    //    }, [i]
    //);

    useTick(() => {
        const movementSpeed = 10;
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
        //if (scrollDown) {
        //    setZ(z + 0.3);
        //    scrollDown = false;
        //}
        //if (scrollUp) {
        //    setZ(z - 0.3);
        //    scrollUp = false;
        //}

        //setI(i + 0.01);

    });

    return (
        <>
            <CameraContext.Provider value={{ x, y, z, zoom }}>
                <SpaceBackground />
                {//<CameraControlBox x={width - 300} y={height - 300} width={300} height={300} />
                }
                <Slider
                    x={30}
                    y={30}
                    boxWidth={500}
                    boxHeight={30}
                    boxColor={0x202040}
                    barSize={100}
                    barPadding={8}
                    barColor={0xb040b0}
                    min={1}
                    max={-6.2}
                    steps={100}
                    orientation={'horizontal'}
                    setValue={setZ}
                    currentValue={z}
                />
                <Slider
                    x={30}
                    y={80}
                    boxWidth={30}
                    boxHeight={500}
                    boxColor={0x202040}
                    barSize={100}
                    barPadding={8}
                    barColor={0xb040b0}
                    min={0.5}
                    max={2}
                    steps={100}
                    orientation={'vertical'}
                    setValue={setZoom}
                    currentValue={zoom}
                />
            </CameraContext.Provider>
        </>
    );
};
