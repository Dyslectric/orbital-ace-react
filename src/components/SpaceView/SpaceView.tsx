import { createContext, useContext, useState } from "react";
import { Background } from "./Background";
import { Camera, CameraControlBox, CameraController, CameraZSlider, CameraZoomSlider } from "../Camera";
import React from "react";
import { ViewportContext } from "../Viewport";

export const SpaceViewContext = createContext({
    cameraViewport: { width: 0, height: 0 },
    setCameraViewport: (viewport: { width: number; height: number }) => {},
    cameraBounds: { left: 0, right: 0, top: 0, bottom: 0 },
    setCameraBounds: (bounds: { left: number; right: number; top: number; bottom: number }) => {},
});

export const SpaceView = () => {
    const viewport = useContext(ViewportContext);

    const [cameraViewport, setCameraViewport] = useState({ width: 1024, height: 1024 });
    const [cameraBounds, setCameraBounds] = useState({ left: -32768, right: 32768, top: -32768, bottom: 32768 });

    const controlBoxPadding = {
        horizontal: 95,
        vertical: 55,
    };

    const controlBoxDimensions = {
        width: 200 + 2 * controlBoxPadding.horizontal,
        height: 200 + 2 * controlBoxPadding.vertical,
    };

    const controlBoxPosition = {
        x: viewport.width - controlBoxDimensions.width,
        y: viewport.height - controlBoxDimensions.height,
    };

    const barsWidth = 30;

    const zoomBarPosition = {
        x: controlBoxPosition.x - barsWidth - 24,
        y: controlBoxPosition.y,
    };

    const zBarPosition = {
        x: controlBoxPosition.x,
        y: controlBoxPosition.y - barsWidth - 24,
    };

    const zBarDimensions = {
        width: controlBoxDimensions.width,
        height: barsWidth,
    };

    const zoomBarDimensions = {
        width: barsWidth,
        height: controlBoxDimensions.height,
    };

    return (
        <SpaceViewContext.Provider value={{ cameraViewport, setCameraViewport, cameraBounds, setCameraBounds }}>
            <Camera>
                <Background />
                <CameraControlBox
                    x={controlBoxPosition.x}
                    y={controlBoxPosition.y}
                    viewport={cameraViewport}
                    bounds={cameraBounds}
                    padding={{
                        left: controlBoxPadding.horizontal,
                        right: controlBoxPadding.horizontal,
                        top: controlBoxPadding.vertical,
                        bottom: controlBoxPadding.vertical,
                    }}
                    boundBoxDimensions={{ width: 200, height: 200 }}
                />
                <CameraZSlider
                    x={zBarPosition.x}
                    y={zBarPosition.y}
                    boxWidth={zBarDimensions.width}
                    boxHeight={zBarDimensions.height}
                    boxColor={0x202040}
                    barSize={zBarDimensions.width / 10}
                    barPadding={8}
                    barColor={0xb040b0}
                    min={24}
                    max={1.0}
                    //steps={100}
                    orientation={"horizontal"}
                />
                <CameraZoomSlider
                    x={zoomBarPosition.x}
                    y={zoomBarPosition.y}
                    boxWidth={zoomBarDimensions.width}
                    boxHeight={zoomBarDimensions.height}
                    boxColor={0x202040}
                    barSize={zoomBarDimensions.height / 10}
                    barPadding={8}
                    barColor={0xb040b0}
                    min={1}
                    max={3}
                    //steps={100}
                    orientation={"vertical"}
                />
                <CameraController bounds={cameraBounds} />
            </Camera>
        </SpaceViewContext.Provider>
    );
};
