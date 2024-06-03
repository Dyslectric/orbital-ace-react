import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { ViewportContext } from "./Viewport.jsx"
import { useTick } from "@pixi/react"
import { Slider } from "./Slider.tsx"

export interface CameraProps {
	areaWidth: number;
	areaHeight: number;
	areaScale: number;
};

export const CameraContext = createContext({
	x: 0, y: 0, z: 0, zoom: 1,
	width: 0, height: 0,
	setX: (x: number) => null,
	setY: (y: number) => null,
	setZ: (z: number) => null,
	setZoom: (zoom: number) => null,
});

export const Camera: FC<CameraProps> = ({
	areaWidth, areaHeight, areaScale, children
}) => {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [z, setZ] = useState(0);
	const [zoom, setZoom] = useState(1);

	const viewport: {width: number, height: number} = useContext(ViewportContext);

	const bgWidth = useMemo(() => areaWidth * areaScale, [areaWidth, areaScale]);
	const bgHeight = useMemo(() => areaHeight * areaScale, [areaHeight, areaScale]);

	return (
		<CameraContext.Provider value={{
			x, y, z, zoom, setX, setY, setZ, setZoom, width: bgWidth, height: bgHeight
		}}>
			{children}
		</CameraContext.Provider>
	)
};

export const CameraZSlider = () => {
	const camera = useContext(CameraContext);
	return (
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
            setValue={camera.setZ}
            currentValue={camera.z}
        />
	);
}

export const CameraZoomSlider = () => {
	const camera = useContext(CameraContext);
	return (
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
            setValue={camera.setZoom}
            currentValue={camera.zoom}
        />
	)
}

export const CameraLogger = () => {
	const camera = useContext(CameraContext);
	useEffect(() => console.log(
		"x:", camera.x,
		"y:", camera.y,
		"z:", camera.z,
		"zoom: ", camera.zoom
	), [camera.x, camera.y, camera.z, camera.zoom]);
}

export const CameraController = () => {
	const camera = useContext(CameraContext);

	let [moveUp, setMoveUp] = useState(false);
	let [moveDown, setMoveDown] = useState(false);
	let [moveLeft, setMoveLeft] = useState(false);
	let [moveRight, setMoveRight] = useState(false);
	let [scrollUp, setScrollUp] = useState(false);
	let [scrollDown, setScrollDown] = useState(false);

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
				setMoveUp(true);
            }
            if (event.key.toUpperCase() == "S") {
				setMoveDown(true);
            }
            if (event.key.toUpperCase() == "A") {
				setMoveLeft(true);
            }
            if (event.key.toUpperCase() == "D") {
				setMoveRight(true);
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.key.toUpperCase() == "W") {
				setMoveUp(false);
            }
            if (event.key.toUpperCase() == "S") {
				setMoveDown(false);
            }
            if (event.key.toUpperCase() == "A") {
				setMoveLeft(false);
            }
            if (event.key.toUpperCase() == "D") {
				setMoveRight(false);
            }
        });
    }, []);

    useTick(() => {
        const movementSpeed = 10;
        if (moveUp) {
            camera.setY(camera.y - 1 * movementSpeed);
        }
        if (moveDown) {
            camera.setY(camera.y + 1 * movementSpeed);
        }
        if (moveLeft) {
            camera.setX(camera.x - 1 * movementSpeed);
        }
        if (moveRight) {
            camera.setX(camera.x + 1 * movementSpeed);
        }
        //if (scrollDown) {
        //    setZ(z + 0.3);
        //    scrollDown = false;
        //}
        //if (scrollUp) {
        //    setZ(z - 0.3);
        //    scrollUp = false;
        //}
    });
}

