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
            Texture.from("./src/assets/bgs/1024/Purple Nebula/Purple_Nebula_01-1024x1024.png"),
            Texture.from("./src/assets/bgs/1024/Green Nebula/Green_Nebula_02-1024x1024.png"),
        ],
        []
    );
    //const nebulaMaskTextures = useMemo(
    //    () => [
    //        Texture.from("./src/assets/masks/pnoise1.png"),
    //        Texture.from("./src/assets/masks/pnoise2.png"),
    //        Texture.from("./src/assets/masks/pnoise3.png"),
    //    ],
    //    []
    //);
    const starfieldZ = 16;
    const nebulasZ = useMemo(() => [8, 7, 6], []);

    return (
        <>
            <Container x={width / 2} y={height / 2}>
                <TilingSpriteComponent
                    texture={starfieldTexture}
                    tilePosition={{ x: -x / starfieldZ, y: -y / starfieldZ }}
                    width={width}
                    height={height}
                    tileScale={ 1 / (z + starfieldZ) }
                />
                {nebulaTextures.map((texture, index) => (
                    <TilingSpriteComponent
                        anchor={0.5}
                        key={index}
                        texture={texture}
                        alpha={0.5}
                        tileScale={ 1 / (z + nebulasZ[index]) }
                        width={width}
                        height={height}
                        tilePosition={{x: width / 2 - x / (z + nebulasZ[index]), y: height / 2 - y / (z + nebulasZ[index])}}
                        //blendMode={BLEND_MODES.ADD}
                    />
                ))}
            </Container>
        </>
    );
};
