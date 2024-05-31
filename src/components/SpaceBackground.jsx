import { Container, TilingSprite as TilingSpriteComponent, render, useApp } from "@pixi/react";
import { BLEND_MODES, Sprite, Texture, TilingSprite } from "pixi.js";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CameraContext } from "./Game";
import { ViewportContext } from "./Viewport";

export const SpaceBackground = () => {
    const app = useApp();
    const { x, y, z } = useContext(CameraContext);
    const { width, height } = useContext(ViewportContext);

    const { renderer } = app;

    const starfieldTexture = useMemo(
        () => Texture.from("./src/assets/bgs/1024/Starfields/Starfield_01-1024x1024.png"),
        []
    );
    const nebulaTextures = useMemo(
        () => [
            Texture.from("./src/assets/bgs/1024/Blue Nebula/Blue_Nebula_01-1024x1024.png"),
            Texture.from("./src/assets/bgs/1024/Green Nebula/Green_Nebula_02-1024x1024.png"),
            Texture.from("./src/assets/bgs/1024/Purple Nebula/Purple_Nebula_01-1024x1024.png"),
        ],
        []
    );
    const nebulaMaskTextures = useMemo(
        () => [
            Texture.from("./src/assets/masks/pnoise1.png"),
            Texture.from("./src/assets/masks/pnoise2.png"),
            Texture.from("./src/assets/masks/pnoise3.png"),
        ],
        []
    );
    const nebulaMasks = useMemo(
        () => [new Sprite(nebulaMaskTextures[0]), new Sprite(nebulaMaskTextures[1]), new Sprite(nebulaMaskTextures[2])],
        []
    );
    useEffect(() => {
        nebulaMasks.forEach((mask) => {
            mask.anchor.set(0.5);
            app.stage.addChild(mask);
            //mask.anchor.set(0.5);
            //mask.scale.set();
        });
    });
    useEffect(() => {
        nebulaMasks.forEach((mask, index) => {
            const nebulaDefaultScale = 24;
            mask.x = width / 2 - x / (z + nebulasZ[index]);
            mask.y = height / 2 - y / (z + nebulasZ[index]);
            mask.scale.set(nebulaDefaultScale * 1 / (z + nebulasZ[index]));
            //mask.width = width;
            //mask.height = height;
        });
    });
    const starfieldZ = 17;
    const nebulasZ = useMemo(() => [16, 15.5, 15], []);

    return (
        <>
            <Container x={width / 2} y={height / 2}>
                <TilingSpriteComponent
                    anchor={0.5}
                    texture={starfieldTexture}
                    tilePosition={{
                        x: width / 2 - x / (z + starfieldZ),
                        y: height / 2 - y / (z + starfieldZ),
                    }}
                    width={width}
                    height={height}
                    tileScale={4 * 1 / (z + starfieldZ)}
                />
                {nebulaTextures.map((texture, index) => (
                    <TilingSpriteComponent
                        anchor={0.5}
                        key={index}
                        texture={texture}
                        alpha={1.0}
                        tileScale={1 / (z + nebulasZ[index])}
                        width={width}
                        height={height}
                        tilePosition={{
                            x: width / 2 - x / (z + nebulasZ[index]),
                            y: height / 2 - y / (z + nebulasZ[index]),
                        }}
                        blendMode={BLEND_MODES.ADD}
                        mask={nebulaMasks[index]}
                    />
                ))}
            </Container>
        </>
    );
};
