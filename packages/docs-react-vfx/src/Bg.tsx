import React, { useEffect, useCallback, createRef, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { isMobile } from "is-mobile";
import Triangle from "./gl/Triangle";
import Fragments from "./gl/Fragments";
import Effects from "./gl/Effects";
import { useSpringValue } from "@react-spring/web";

const canvasStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1,
    pointerEvents: "none",
    background: "#222222",
};

const Bg: React.FC = () => {
    const { camera } = useThree();

    const top = useSpringValue(0);

    const onScroll = useCallback(() => {
        const scroll = window.scrollY;

        if (typeof window === "undefined" || typeof document === "undefined") {
            return 0;
        }
        if (typeof scroll !== "number") {
            return 0;
        }

        top.start(scroll / (document.body.scrollHeight - window.innerHeight));
    }, [top]);

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") {
            return;
        }
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    useFrame(() => {
        const s = top.get() ?? 0;
        camera.rotation.set(-Math.PI * 0.1 - s * Math.PI * 0.4, 0, 0);
    });

    return (
        <>
            <Triangle scroll={top} />
            <Fragments count={isMobile() ? 1200 : 2500} scroll={top} />
        </>
    );
};

const BG: React.FC = () => (
    <Canvas style={canvasStyle as any}>
        <Effects />
        <Bg />
    </Canvas>
);

export default BG;
