import { Container as ContainerComponent, TilingSprite as TilingSpriteComponent, Sprite as SpriteComponent, render, useApp } from "@pixi/react";
import { BLEND_MODES, Container, Sprite, Texture, TilingSprite } from "pixi.js";
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CameraContext } from "./Game";
import { ViewportContext } from "./Viewport";

export interface SpaceBackgroundLayerProps {
    texture: Texture;
    z: number;
    mask?: Texture;
}

export const SpaceBackgroundLayer: FC<SpaceBackgroundLayerProps> = ({ texture, z, mask }) => {
    const camera = useContext(CameraContext);
    const viewport = useContext(ViewportContext);
    const maskSprite: Sprite | undefined = mask ? useMemo(() => Sprite.from(mask), [mask]) : undefined;
    const app = useApp();

    const distance = camera.z - z;

    useEffect(() => {
        if(maskSprite) {
            app.stage.addChild(maskSprite);
            maskSprite.anchor.set(0.5);
        }
    }, []);

    useEffect(() => {
        if (maskSprite) {
            maskSprite.scale.set((32 + z) / distance);
            maskSprite.x = viewport.width / 2 - camera.x / distance;
            maskSprite.y = viewport.height / 2 - camera.y / distance;
        }
    }, [maskSprite, camera.x, camera.y, distance, z]);

    return (
        maskSprite ? 
        <TilingSpriteComponent
            mask={maskSprite}
            texture={texture}
            width={viewport.width}
            height={viewport.height}
            tileScale={{x: 1 / (camera.z - z), y: 1 / (camera.z - z)}}
            anchor={0.5}
            alpha={0.8}
            x={viewport.width / 2}
            y={viewport.height / 2}
            tilePosition={{
                x: viewport.width / 2 - camera.x / distance,
                y: viewport.height / 2 - camera.y / distance,
            }}
            blendMode={BLEND_MODES.ADD}
        /> :
        <TilingSpriteComponent
            texture={texture}
            width={viewport.width}
            height={viewport.height}
            tileScale={{x: 1 / distance, y: 1 / distance}}
            anchor={0.5}
            alpha={0.8}
            x={viewport.width / 2}
            y={viewport.height / 2}
            tilePosition={{
                x: viewport.width / 2 - camera.x / distance,
                y: viewport.height / 2 - camera.y / distance,
            }}
            blendMode={BLEND_MODES.ADD}
        />
    );
};

export const SpaceBackground = () => {
    const starfield = useMemo(() => {
        return ({
            texture: Texture.from("./src/assets/bgs/1024/Starfields/Starfield_01-1024x1024.png"),
            z: -14.3
        })
    }, []);

    const nebulas = [
        {
            texture: Texture.from("./src/assets/bgs/1024/Blue Nebula/Blue_Nebula_01-1024x1024.png"),
            z: -16,
            mask: Texture.from("./src/assets/masks/pnoise5.png"),
        },
        {
            texture: Texture.from("./src/assets/bgs/1024/Green Nebula/Green_Nebula_02-1024x1024.png"),
            z: -15.5,
            mask: Texture.from("./src/assets/masks/pnoise1.png"),
        },
        {
            texture: Texture.from("./src/assets/bgs/1024/Purple Nebula/Purple_Nebula_01-1024x1024.png"),
            z: -15,
            mask: Texture.from("./src/assets/masks/pnoise2.png"),
        },
        {
            texture: Texture.from("./src/assets/bgs/1024/Blue Nebula/Blue_Nebula_08-1024x1024.png"),
            z: -14.5,
            mask: Texture.from("./src/assets/masks/pnoise3.png"),
        },
        {
            texture: Texture.from("./src/assets/bgs/1024/Green Nebula/Green_Nebula_07-1024x1024.png"),
            z: -14,
            mask: Texture.from("./src/assets/masks/pnoise4.png"),
        },
    ]

    return (
        <>
            <SpaceBackgroundLayer texture={starfield.texture} z={starfield.z} />

            {nebulas.map((nebula, index) => (
                <SpaceBackgroundLayer
                    key={index}
                    texture={nebula.texture}
                    z={nebula.z}
                    mask={nebula.mask}
                />
            ))}
        </>
    );
};
