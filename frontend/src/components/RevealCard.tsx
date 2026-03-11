import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RevealCardProps {
    title: string;
    content: string;
    delay?: number;
    icon?: React.ReactNode;
}

export function RevealCard({ title, content, delay = 0, icon }: RevealCardProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        const chars = content.split('');
        let timeoutId: NodeJS.Timeout;

        timeoutId = setTimeout(() => {
            let currentText = "";
            let i = 0;

            const typeNextChar = () => {
                if (i < chars.length) {
                    currentText += chars[i];
                    setDisplayedText(currentText);
                    i++;
                    // Randomize typing speed slightly for realism (between 10ms and 40ms)
                    setTimeout(typeNextChar, Math.random() * 30 + 10);
                }
            };

            typeNextChar();

        }, delay * 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [content, delay]);

    const isComplete = displayedText === content;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
            className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-gold/40 transition-colors"
        >
            {/* Decorative gradient blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-mystic-purple/20 rounded-full blur-[40px] group-hover:bg-gold/20 transition-colors duration-700 pointer-events-none" />

            <div className="flex items-center gap-3 border-b border-glass-border pb-3 z-10">
                {icon && <div className="text-gold">{icon}</div>}
                <h3 className="font-serif text-xl text-foreground tracking-wide font-medium">{title}</h3>
            </div>
            <div className="text-[15px] font-sans text-foreground/80 leading-relaxed min-h-[120px] z-10">
                {displayedText}
                {!isComplete && (
                    <span className="inline-block w-[6px] h-[1em] bg-gold animate-pulse ml-1 align-middle" />
                )}
            </div>
        </motion.div>
    );
}
