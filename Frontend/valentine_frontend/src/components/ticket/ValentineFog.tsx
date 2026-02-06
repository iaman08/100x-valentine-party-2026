'use client'; // <--- MUST HAVE THIS

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ValentineFogProps {
    children: React.ReactNode;
}

const ValentineFog: React.FC<ValentineFogProps> = ({ children }) => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const effectRef = useRef<any>(null);

    useEffect(() => {
        // Vanta requires THREE on window
        (window as any).THREE = THREE;

        const loadVanta = async () => {
            try {
                if (effectRef.current) return; // Already initialized
                if (!vantaRef.current) return;

                const VantaFog = (await import('vanta/dist/vanta.fog.min')).default;

                effectRef.current = VantaFog({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0xff0a54,
                    midtoneColor: 0x590d22,
                    lowlightColor: 0x2a0a12,
                    baseColor: 0x0f0305,
                    blurFactor: 0.65,
                    speed: 1.80,
                    zoom: 1.20,
                });
            } catch (error) {
                console.error('Vanta.js initialization failed:', error);
            }
        };

        loadVanta();

        return () => {
            if (effectRef.current) {
                effectRef.current.destroy();
                effectRef.current = null;
            }
        };
    }, []);

    return (
        <div ref={vantaRef} className="relative min-h-screen w-full overflow-hidden" style={{ background: '#0f0305' }}>
            <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ValentineFog;