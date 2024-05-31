import { useTick } from "@pixi/react";
import { SpaceBackground } from "./SpaceBackground";
import { createContext, useEffect, useState } from "react";

let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;
let scrollUp = false;
let scrollDown = false;

export const CameraContext = createContext({x: 0, y: 0, z: 0, zoom: 1});

export const Game = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        window.addEventListener('wheel', event => {
            if (event.deltaY > 0) {
                scrollDown = true;
            } else if (event.deltaY < 0) {
                scrollUp = true;
            }
        });
        window.addEventListener('keydown', event => {
            if(event.key.toUpperCase() == "W") {
                moveUp = true;
            } if(event.key.toUpperCase() == "S") {
                moveDown = true;
            } if(event.key.toUpperCase() == "A") {
                moveLeft = true;
            } if(event.key.toUpperCase() == "D") {
                moveRight = true;
            }
        });
        window.addEventListener('keyup', event => {
            if(event.key.toUpperCase() == "W") {
                moveUp = false;
            } if(event.key.toUpperCase() == "S") {
                moveDown = false;
            } if(event.key.toUpperCase() == "A") {
                moveLeft = false;
            } if(event.key.toUpperCase() == "D") {
                moveRight = false;
            }
        });
    }, []);

    useTick(() => {
        const movementSpeed = 10;
        if(moveUp) {
            setY(y - 1 * movementSpeed);
        } if(moveDown) {
            setY(y + 1 * movementSpeed);
        } if(moveLeft) {
            setX(x - 1 * movementSpeed);
        } if(moveRight) {
            setX(x + 1 * movementSpeed);
        } if(scrollDown) {
            setZ(z + 0.3);
            scrollDown = false;
        } if(scrollUp) {
            setZ(z - 0.3);
            scrollUp = false;
        }
    });

    return (
        <>
            <CameraContext.Provider value={{x, y, z}}>
                <SpaceBackground />
            </CameraContext.Provider>
        </>
    )
};