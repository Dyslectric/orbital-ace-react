import {
    Container as ContainerComponent,
    TilingSprite as TilingSpriteComponent,
    Sprite as SpriteComponent,
    render,
    useApp,
} from "@pixi/react";
import { BLEND_MODES, Container, Sprite, Texture, TilingSprite } from "pixi.js";
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CameraContext } from "../Camera";
import { ViewportContext } from "../Viewport";
import { SpaceViewContext } from "./SpaceView";

export interface SpaceBackgroundLayerProps {
    texture: Texture;
    z: number;
    mask?: Texture;
    scale?: number;
    maskScale?: number;
}

export const SpaceBackgroundLayer: FC<SpaceBackgroundLayerProps> = ({ texture, z, mask, scale, maskScale }) => {
    const camera = useContext(CameraContext);
    const viewport = useContext(ViewportContext);
    const maskSprite: Sprite | null = useMemo(() => (mask ? Sprite.from(mask) : null), [mask]);
    const app = useApp();

    const distance = camera.z - z;
    const layerScale = ((scale ? scale : 1) / distance) * camera.zoom;

    useEffect(() => {
        if (maskSprite) {
            maskSprite.anchor.set(0.5);

            const container = new Container();
            container.x = viewport.width / 2;
            container.y = viewport.height / 2;

            container.addChild(maskSprite);
            app.stage.addChild(container);
        }
    }, [viewport.width, viewport.height]);

    useEffect(() => {
        if (maskSprite) {
            maskSprite.scale.set(((maskScale ? maskScale : 1) / distance) * camera.zoom);
            maskSprite.x = (-camera.x / distance) * camera.zoom;
            maskSprite.y = (-camera.y / distance) * camera.zoom;
        }
    }, [maskSprite, camera.x, camera.y, distance, z, camera.zoom]);

    return (
        <ContainerComponent x={viewport.width / 2} y={viewport.height / 2}>
            <TilingSpriteComponent
                mask={maskSprite}
                texture={texture}
                width={viewport.width}
                height={viewport.height}
                tileScale={{ x: layerScale, y: layerScale }}
                anchor={0.5}
                alpha={1.0}
                tilePosition={{
                    x: viewport.width / 2 - (camera.x / distance) * camera.zoom,
                    y: viewport.height / 2 - (camera.y / distance) * camera.zoom,
                }}
                //blendMode={BLEND_MODES.ADD}
            />
        </ContainerComponent>
    );
};

export const Background = () => {
    const spaceView = useContext(SpaceViewContext);
    const viewport = useContext(ViewportContext);
    const camera = useContext(CameraContext);

    const cameraBoundsWidth = spaceView.cameraBounds.right - spaceView.cameraBounds.right;
    const cameraBoundsHeight = spaceView.cameraBounds.bottom - spaceView.cameraBounds.top;

    const cameraViewport = useMemo(() => {
        return {
            width: (viewport.width * camera.z) / camera.zoom,
            height: (viewport.height * camera.z) / camera.zoom,
        };
    }, [window.innerWidth, viewport.width, viewport.height, camera.z, camera.zoom]);

    useEffect(() => {
        spaceView.setCameraViewport(cameraViewport);
    }, [cameraViewport]);

    const starfield = useMemo(() => {
        return {
            texture: Texture.from("./assets/bgs/1024/Starfields/Starfield_01-1024x1024.png"),
            z: -23,
            scale: 8,
        };
    }, []);

    const nebulas = [
        {
            texture: Texture.from("./assets/bgs/1024/Blue Nebula/Blue_Nebula_01-1024x1024.png"),
            z: -22,
            mask: Texture.from("./assets/masks/nebulamask2.png"),
            maskScale: 144 + 8,
        },
        {
            texture: Texture.from("./assets/bgs/1024/Green Nebula/Green_Nebula_04-1024x1024.png"),
            z: -18,
            mask: Texture.from("./assets/masks/nebulamask3.png"),
            maskScale: 144,
        },
        //{
        //    texture: Texture.from("./assets/bgs/1024/Purple Nebula/Purple_Nebula_01-1024x1024.png"),
        //    z: -16,
        //    mask: Texture.from("./assets/masks/nebulamask3.png"),
        //    maskScale: 144 + 4,
        //},
        {
            texture: Texture.from("./assets/bgs/1024/Blue Nebula/Blue_Nebula_08-1024x1024.png"),
            z: -12,
            mask: Texture.from("./assets/masks/nebulamask7.png"),
            maskScale: 128 + 4,
        },
        {
            texture: Texture.from("./assets/bgs/1024/Green Nebula/Green_Nebula_07-1024x1024.png"),
            z: -8,
            mask: Texture.from("./assets/masks/nebulamask2.png"),
            maskScale: 128,
        },
    ];

    return (
        <>
            <SpaceBackgroundLayer texture={starfield.texture} z={starfield.z} scale={starfield.scale} />

            {nebulas.map((nebula, index) => (
                <SpaceBackgroundLayer
                    key={index}
                    texture={nebula.texture}
                    z={nebula.z}
                    mask={nebula.mask}
                    maskScale={nebula.maskScale}
                    scale={8.0}
                />
            ))}
        </>
    );
};
