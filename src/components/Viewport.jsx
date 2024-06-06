import { useApp } from "@pixi/react";
import { createContext, useEffect, useMemo, useState } from "react";

export const ViewportContext = createContext({ width: window.innerWidth, height: window.innerHeight });

export const Viewport = ({ children }) => {
    const app = useApp();
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [window.innerWidth, window.innerHeight]);

    return (
        <>
            <ViewportContext.Provider value={{ width, height }}>{children}</ViewportContext.Provider>
        </>
    );
};
