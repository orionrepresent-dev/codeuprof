import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MandalaProps {
    vibrationalSignature: number;
    hash: string;
    size?: number;
}

export function Mandala({ vibrationalSignature, hash, size = 300 }: MandalaProps) {
    // Base sides from vibrational_signature, fallback to 4. Max 12.
    const sides = Math.max(3, Math.min(12, vibrationalSignature || 4));

    // Create polygon path for SVG based on sides and radius
    const createPolygon = (radius: number, offsetAngle: number = 0) => {
        let path = "";
        for (let i = 0; i < sides; i++) {
            const currentAngle = offsetAngle + (i * 2 * Math.PI) / sides;
            const x = radius * Math.cos(currentAngle);
            const y = radius * Math.sin(currentAngle);
            if (i === 0) {
                path += `M ${x} ${y} `;
            } else {
                path += `L ${x} ${y} `;
            }
        }
        path += "Z";
        return path;
    };

    const center = size / 2;

    // The 3 SVG paths
    const layer1Path = useMemo(() => createPolygon(center * 0.8), [sides, center]);
    const layer2Path = useMemo(() => createPolygon(center * 0.5, Math.PI / sides), [sides, center]);
    const layer3Path = useMemo(() => createPolygon(center * 0.25), [sides, center]);

    return (
        <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
            {/* Outer Glow */}
            <motion.div
                className="absolute w-full h-full rounded-full blur-[64px] bg-gold opacity-20 pointer-events-none"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <svg
                width={size}
                height={size}
                viewBox={`-${center} -${center} ${size} ${size}`}
                className="overflow-visible"
            >
                {/* Camada 1: Círculo Externo e Polígono Base */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                >
                    <circle r={center * 0.9} fill="none" stroke="#D4AF37" strokeWidth="1" opacity={0.3} strokeDasharray="4 4" />
                    <motion.path
                        d={layer1Path}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="2"
                        opacity={0.6}
                        initial={false}
                        animate={{ d: layer1Path }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </motion.g>

                {/* Camada 2: Contrarotação */}
                <motion.g
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                    <circle r={center * 0.6} fill="none" stroke="#7C3AED" strokeWidth="1" opacity={0.4} />
                    <motion.path
                        d={layer2Path}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="1.5"
                        opacity={0.8}
                        initial={false}
                        animate={{ d: layer2Path }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </motion.g>

                {/* Camada 3: Núcleo Interno */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    <circle r={center * 0.3} fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity={0.8} />
                    <motion.path
                        d={layer3Path}
                        fill="#D4AF37"
                        fillOpacity={0.1}
                        stroke="#D4AF37"
                        strokeWidth="2"
                        initial={false}
                        animate={{ d: layer3Path }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </motion.g>

                {/* Core Dot */}
                <circle r={4} fill="#F8FAFC" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </svg>
        </div>
    );
}
