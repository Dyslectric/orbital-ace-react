import { useTick } from "@pixi/react";
import { SpaceBackground } from "./SpaceBackground";
import { createContext, useContext, useEffect, useState } from "react";
import { Camera, CameraZSlider, CameraZoomSlider, CameraController } from "./Camera";
import { CameraControlBox } from "./CameraControlBox";
import { ViewportContext } from "./Viewport";
import { Slider } from "./Slider";

export const Game = () => {
	const viewport = useContext(ViewportContext);

    return (
        <>
            <Camera areaWidth={4096} areaHeight={4096} areaZoom={1}>
                <SpaceBackground />
                <CameraControlBox
					x={viewport.width - 300}
					y={viewport.height - 300}
					width={300}
					height={300} 
					areaWidth={8192}
					areaHeight={8192}
					areaDistance={16}
				/>
				<CameraZSlider />
				<CameraZoomSlider />
				<CameraController />
            </Camera>
        </>
    );
};
