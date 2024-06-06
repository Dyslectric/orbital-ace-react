import { createContext, useState, useMemo, useContext, useEffect, FC, ReactNode, useCallback, useReducer } from "react";
import { ViewportContext } from "./Viewport.jsx";
import { Stage, Container, Graphics, useTick, useApp } from "@pixi/react";
import { Slider } from "./Slider.tsx";
import React from "react";
import { FederatedMouseEvent } from "pixi.js";

export const CameraContext = createContext({
    x: 0,
    y: 0,
    z: 0,
    zoom: 1,
    setX: (x: number) => {},
    setY: (y: number) => {},
    setZ: (z: number) => {},
    setZoom: (zoom: number) => {},
});

export const Camera: FC<{ children?: ReactNode }> = ({ children }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(1);
    const [zoom, setZoom] = useState(1);

    return (
        <CameraContext.Provider
            value={{
                x,
                y,
                z,
                zoom,
                setX,
                setY,
                setZ,
                setZoom,
            }}
        >
            {children}
        </CameraContext.Provider>
    );
};

export interface GraphicalSliderProps {
    x: number;
    y: number;
    boxWidth: number;
    boxHeight: number;
    boxColor: number;
    barSize: number;
    barPadding: number;
    barColor: number;
    min: number;
    max: number;
    orientation: "horizontal" | "vertical";
}

export const CameraZSlider: FC<GraphicalSliderProps> = ({
    x,
    y,
    boxWidth,
    boxHeight,
    boxColor,
    barSize,
    barPadding,
    barColor,
    min,
    max,
    orientation,
}) => {
    const camera = useContext(CameraContext);
    return (
        <Slider
            x={x}
            y={y}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            boxColor={boxColor}
            barSize={barSize}
            barPadding={barPadding}
            barColor={barColor}
            min={min}
            max={max}
            orientation={orientation}
            setValue={camera.setZ}
            currentValue={camera.z}
        />
    );
};

export const CameraZoomSlider: FC<GraphicalSliderProps> = ({
    x,
    y,
    boxWidth,
    boxHeight,
    boxColor,
    barSize,
    barPadding,
    barColor,
    min,
    max,
    orientation,
}) => {
    const camera = useContext(CameraContext);
    return (
        <Slider
            x={x}
            y={y}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            boxColor={boxColor}
            barSize={barSize}
            barPadding={barPadding}
            barColor={barColor}
            min={min}
            max={max}
            orientation={orientation}
            setValue={camera.setZoom}
            currentValue={camera.zoom}
        />
    );
};

export interface CameraControlBounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface CameraControlBoxProps {
    x: number;
    y: number;
    boundBoxDimensions: {
        width: number;
        height: number;
    };
    viewport: { width: number; height: number };
    bounds: CameraControlBounds;
    padding: { left: number; right: number; top: number; bottom: number };
}

export const CameraControlBox: FC<CameraControlBoxProps> = ({
    x,
    y,
    boundBoxDimensions,
    viewport,
    bounds,
    padding,
}) => {
    const app = useApp();
    const camera = useContext(CameraContext);

    const boundsDimensions = {
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    };

    const camBox = useMemo(() => {
        const boxWidthRatio = viewport.width / (bounds.right - bounds.left);
        const boxHeightRatio = viewport.height / (bounds.bottom - bounds.top);
        const boxWidth = boundBoxDimensions.width * boxWidthRatio;
        const boxHeight = boundBoxDimensions.height * boxHeightRatio;
        const x = ((camera.x - bounds.left) / boundsDimensions.width) * boundBoxDimensions.width - boxWidth / 2;
        const y = ((camera.y - bounds.top) / boundsDimensions.height) * boundBoxDimensions.height - boxHeight / 2;

        return {
            x,
            y,
            width: boxWidth,
            height: boxHeight,
        };
    }, [camera.x, camera.y, camera.z, camera.zoom, viewport.width, viewport.height]);

    const drawPaddingBox = useCallback((graphics) => {
        graphics.clear();
        graphics.beginFill(0x000030);
        graphics.drawRect(
            0,
            0,
            boundBoxDimensions.width + padding.left + padding.right,
            boundsDimensions.height + padding.top + padding.bottom,
        );
        graphics.endFill();
    }, []);

    const drawBgBox = useCallback((graphics) => {
        graphics.clear();
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, boundBoxDimensions.width, boundBoxDimensions.height);
        graphics.endFill();
    }, []);

    const drawCameraBox = useCallback(
        (graphics) => {
            graphics.clear();
            graphics.beginFill(0xff00ff);
            graphics.drawRect(camBox.x, camBox.y, camBox.width, camBox.height);
            graphics.endFill();
        },
        [camBox.x, camBox.y, camBox.width, camBox.height],
    );

    let [activated, setActivated] = useState(false);
    let [mouseInitPos, setMouseInitPos] = useState({ x: 0, y: 0 });
    let [cameraInitPos, setCameraInitPos] = useState({ x: 0, y: 0 });

    const mouseDown = useCallback(
        (event: FederatedMouseEvent) => {
            if (
                event.x > x + padding.left + camBox.x &&
                event.x < x + padding.left + camBox.x + camBox.width &&
                event.y > y + padding.top + camBox.y &&
                event.y < y + padding.top + camBox.y + camBox.height
            ) {
                setActivated(true);
                setMouseInitPos({ x: event.x, y: event.y });
                setCameraInitPos({ x: camera.x, y: camera.y });
            }
        },
        [camBox, camera.x, camera.y],
    );

    const mouseUp = useCallback(() => {
        setActivated(false);
    }, []);

    const mouseMove = useCallback(
        (event: FederatedMouseEvent) => {
            if (activated) {
                const movement = { x: event.x - mouseInitPos.x, y: event.y - mouseInitPos.y };
                const x = cameraInitPos.x + movement.x * (boundsDimensions.width / boundBoxDimensions.width);
                const y = cameraInitPos.y + movement.y * (boundsDimensions.height / boundBoxDimensions.height);

                if (x < bounds.left) {
                    camera.setX(bounds.left);
                } else if (x > bounds.right) {
                    camera.setX(bounds.right);
                } else {
                    camera.setX(x);
                }

                if (y < bounds.top) {
                    camera.setY(bounds.top);
                } else if (y > bounds.bottom) {
                    camera.setY(bounds.bottom);
                } else {
                    camera.setY(y);
                }
            }
        },
        [camBox, activated, cameraInitPos, mouseInitPos],
    );

    useEffect(() => {
        //let mouseInitPos = { x: 0, y: 0 };
        //let cameraInitPos = { x: 0, y: 0 };
        ////drawCamBox();
        //app.stage.addEventListener("mousedown", (event: FederatedMouseEvent) => {
        //    if (
        //        event.x > x + padding.horizontal + camBox.x &&
        //        event.x < x + padding.horizontal + camBox.width &&
        //        event.y > y + padding.vertical + camBox.y &&
        //        event.y < y + padding.vertical + camBox.height
        //    ) {
        //        activated = true;
        //        mouseInitPos = { x: event.x, y: event.y };
        //        cameraInitPos = { x: camera.x, y: camera.y };
        //    }
        //});
        app.stage.interactive = true;
        app.stage.addEventListener("mouseup", mouseUp);
        app.stage.addEventListener("mousemove", mouseMove);

        return () => {
            app.stage.removeEventListener("mouseup", mouseUp);
            app.stage.removeEventListener("mousemove", mouseMove);
        };
        //app.stage.addEventListener("mousemove", (event: FederatedMouseEvent) => {
        //    if (activated) {
        //        const movement = { x: event.x - mouseInitPos.x, y: event.y - mouseInitPos.y };
        //        const x = cameraInitPos.x + movement.x * (boundsDimensions.width / innerWidth);
        //        const y = cameraInitPos.y + movement.y * (boundsDimensions.height / innerHeight);
        //        camera.setX(x);
        //        camera.setY(y);
        //    }
        //});
    }, [mouseUp, mouseMove]);

    return (
        <Container x={x} y={y}>
            <Graphics draw={drawPaddingBox} />
            <Graphics draw={drawBgBox} x={padding.left} y={padding.top} />
            <Graphics
                draw={drawCameraBox}
                x={padding.left}
                y={padding.top}
                interactive={true}
                mousedown={mouseDown}
                //mousemove={mouseMove}
            />
        </Container>
    );
};

export interface CameraControllerProps {
    bounds?: CameraControlBounds;
}

export const CameraController: FC<CameraControllerProps> = ({ bounds }) => {
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
            if (bounds && camera.y > bounds.top) {
                camera.setY(camera.y - 1 * movementSpeed);
            } else if (!bounds) {
                camera.setY(camera.y - 1 * movementSpeed);
            }
        }
        if (moveDown) {
            if (bounds && camera.y < bounds.bottom) {
                camera.setY(camera.y + 1 * movementSpeed);
            } else if (!bounds) {
                camera.setY(camera.y + 1 * movementSpeed);
            }
        }
        if (moveLeft) {
            if (bounds && camera.x > bounds.left) {
                camera.setX(camera.x - 1 * movementSpeed);
            } else if (!bounds) {
                camera.setX(camera.x - 1 * movementSpeed);
            }
        }
        if (moveRight) {
            if (bounds && camera.x < bounds.right) {
                camera.setX(camera.x + 1 * movementSpeed);
            } else if (!bounds) {
                camera.setX(camera.x + 1 * movementSpeed);
            }
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
    return <></>;
};
