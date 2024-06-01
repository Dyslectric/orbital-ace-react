import { Container, useApp } from "@pixi/react";
import { FederatedMouseEvent, Graphics } from "pixi.js";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Graphics as GraphicsComponent } from "@pixi/react";
import React from "react";
import { ViewportContext } from "./Viewport";

export type SliderOrientation = "vertical" | "horizontal";

export interface SliderProps {
    boxWidth: number;
    boxHeight: number;
    boxColor?: string;
    barSize: number;
    barPadding: number;
    barColor?: string;
    x: number;
    y: number;
    min: number;
    max: number;
    steps: number;
    orientation: SliderOrientation;
    currentValue?: number;
    setValue?: (number) => void;
}

export const Slider: FC<SliderProps> = ({
    boxWidth,
    boxHeight,
    boxColor,
    barSize,
    barPadding,
    barColor,
    x,
    y,
    min,
    max,
    steps,
    orientation,
    currentValue,
    setValue,
}) => {
    const { width: viewportWidth, height: viewportHeight } = useContext(ViewportContext);

    const app = useApp();
    const boxCenter = {
        x: boxWidth / 2,
        y: boxHeight / 2,
    };

    const { barWidth, barHeight } = useMemo(
        () =>
            orientation == "horizontal"
                ? { barWidth: barSize, barHeight: boxHeight - barPadding * 2 }
                : { barWidth: boxWidth - barPadding * 2, barHeight: barSize },
        []
    );

    const barCenter = {
        x: barWidth / 2,
        y: barHeight / 2,
    };

    //const startPixel = barPadding;
    const startPixel = orientation == "horizontal" ? barPadding : boxHeight - barPadding - barHeight;
    //const endPixel =
    //    orientation == "horizontal" ? boxWidth - barPadding - barWidth : ;
    const endPixel = orientation == "horizontal" ? boxWidth - barPadding - barWidth : barPadding;

    const [sliderValue, setSliderValue] = useState(0);

    //const barX = boxCenter.x - barCenter.x;
    const barX =
        orientation == "horizontal"
            ? useMemo(() => startPixel + (endPixel - startPixel) * sliderValue, [sliderValue])
            : boxCenter.x - barCenter.x;

    const barY =
        orientation == "vertical"
            ? useMemo(() => startPixel + (endPixel - startPixel) * sliderValue, [sliderValue])
            : boxCenter.y - barCenter.y;

    const drawSliderBox = useCallback(
        (graphics: Graphics) => {
            graphics
                .clear()
                .beginFill(boxColor ? boxColor : 0x303030)
                .drawRect(0, 0, boxWidth, boxHeight)
                .endFill();
        },
        [boxWidth, boxHeight]
    );

    const drawSliderBar = useCallback(
        (graphics: Graphics) => {
            graphics
                .clear()
                .beginFill(barColor ? barColor : 0x808080)
                .drawRect(barX, barY, barWidth, barHeight)
                .endFill();
        },
        [barSize, barPadding, barX, barY]
    );

    let activated = false;

    const mouseDown = useCallback(
        (event) => {
            activated = true;
        },
        [x, y]
    );

    const mouseUp = useCallback(
        (event) => {
            activated = false;
        },
        [x, y]
    );

    const mouseMove = useCallback(
        (event: FederatedMouseEvent) => {
            if (activated) {
                const { x: mouseX, y: mouseY } = event;

                const localMouseX = mouseX - x;
                const localMouseY = mouseY - y;

                const range = endPixel - startPixel;
                const value =
                    orientation == "vertical"
                        ? Math.max(0, Math.min(1, (localMouseY - (startPixel + barHeight / 2)) / range))
                        : Math.max(0, Math.min(1, (localMouseX - (startPixel + barWidth / 2)) / range));

                setSliderValue(value);
                if (setValue) {
                    setValue(min + (max - min) * value);
                }
            }
        },
        [x, y]
    );

    useEffect(() => {
        app.stage.addEventListener("mousemove", mouseMove);
        app.stage.interactive = true;
    }, []);

    return (
        <Container
            position={{ x, y }}
            width={boxWidth}
            height={boxHeight}
            interactive={true}
            //mousemove={mouseMove}
            mousedown={mouseDown}
            mouseupoutside={mouseUp}
            mouseup={mouseUp}
        >
            <GraphicsComponent draw={drawSliderBox} />
            <GraphicsComponent draw={drawSliderBar} />
        </Container>
    );
};

//export const Slider = ({...orientation}: {
//    width: number,
//    height: number,
//    x: number,
//    y: number,
//    min: number,
//    max: number,
//    setValue: (number) => void,
//    orientation: SliderOrientation
//}) => {
//}
