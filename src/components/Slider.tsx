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
    boxColor?: string | number;
    barSize: number;
    barPadding: number;
    barColor?: string | number;
    x: number;
    y: number;
    min: number;
    max: number;
    steps?: number;
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
        [],
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

    useEffect(() => {
        if (currentValue) {
            if (max - min >= 0) {
                if (currentValue < min) {
                    setSliderValue(0);
                } else if (currentValue > max) {
                    setSliderValue(1);
                } else {
                    setSliderValue((currentValue - min) / (max - min));
                }
            } else {
                if (currentValue > min) {
                    setSliderValue(0);
                } else if (currentValue < max) {
                    setSliderValue(1);
                } else {
                    setSliderValue((currentValue - min) / (max - min));
                }
            }
        }
    }, [currentValue]);

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
        [boxWidth, boxHeight],
    );

    const drawSliderBar = useCallback(
        (graphics: Graphics) => {
            graphics
                .clear()
                .beginFill(barColor ? barColor : 0x808080)
                .drawRect(barX, barY, barWidth, barHeight)
                .endFill();
        },
        [barSize, barPadding, barX, barY],
    );

    let [activated, setActivated] = useState(false);
    let [mouseInitPos, setMouseInitPos] = useState({ x: 0, y: 0 });
    let [sliderInitPos, setSliderInitPos] = useState(sliderValue);

    const mouseDown = useCallback(
        (event: FederatedMouseEvent) => {
            setActivated(true);
            setMouseInitPos({ x: event.x, y: event.y });
            setSliderInitPos(sliderValue);
        },
        [x, y, sliderValue],
    );

    const mouseUp = useCallback(() => {
        setActivated(false);
    }, []);

    const mouseMove = useCallback(
        (event: FederatedMouseEvent) => {
            if (activated) {
                const { x: mouseX, y: mouseY } = event;

                const range = endPixel - startPixel;
                const movement =
                    (orientation == "vertical" ? mouseY - mouseInitPos.y : mouseX - mouseInitPos.x) / range;
                const value = sliderInitPos + movement;

                if (value < 0) {
                    setSliderValue(0);
                    if (setValue) {
                        setValue(min);
                    }
                } else if (value > 1) {
                    setSliderValue(1);
                    if (setValue) {
                        setValue(max);
                    }
                } else {
                    setSliderValue(value);
                    if (setValue) {
                        setValue(min + (max - min) * value);
                    }
                }
            }
        },
        [x, y, sliderInitPos, mouseInitPos, activated],
    );

    useEffect(() => {
        app.stage.addEventListener("mousemove", mouseMove);
        app.stage.addEventListener("mouseup", mouseUp);
        app.stage.interactive = true;
        return () => {
            app.stage.removeEventListener("mousemove", mouseMove);
            app.stage.removeEventListener("mouseup", mouseUp);
        };
    }, [mouseMove, mouseUp]);

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
