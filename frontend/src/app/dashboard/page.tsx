"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSymbolicEngine } from '@/hooks/useSymbolicEngine';
import { Mandala } from '@/components/Mandala';
import { RevealCard } from '@/components/RevealCard';
import { ChatFollowUp } from '@/components/ChatFollowUp';
import { Sparkles, Eye, Brain, Key } from 'lucide-react';

export default function DashboardPage() {
    const { state, loadingMessage, result, startRevelation, reset } = useSymbolicEngine();

    // Simple start trigger for testing if not already running or completed
    useEffect(() => {
        if (state === 'IDLE') {
            const timeout = setTimeout(() => {
                startRevelation({ query: "Iniciação Hermética" });
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [state, startRevelation]);

    return (
        <div className="min-h-screen w-full relative bg-background text-foreground overflow-x-hidden font-sans">
            {/* Texture Layer via Globals CSS */}
            <div className="absolute inset-0 bg-grain pointer-events-none z-50"></div>

            <main className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">

                <AnimatePresence mode="wait">

                    {/* STATE: INCUBATION */}
                    {state === 'INCUBATION' && (
                        <motion.div
                            key="incubation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 1 } }}
                            className="flex flex-col items-center justify-center text-center gap-8"
                        >
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                {/* Loader inspirado em poeira estelar e órbitas */}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-full h-full rounded-full border border-gold/20 border-t-gold/80 border-b-mystic-purple/50 mix-blend-screen"
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 3 + (i * 1.5),
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={{
                                            scale: 1 - (i * 0.15)
                                        }}
                                    />
                                ))}

                                {/* Estrelinhas centrais */}
                                <div className="absolute z-20 flex items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Sparkles className="text-gold w-10 h-10" />
                                    </motion.div>
                                </div>

                                {/* Glow central */}
                                <div className="absolute w-24 h-24 bg-mystic-purple/40 rounded-full blur-xl pointer-events-none" />
                            </div>

                            <motion.h2
                                key={loadingMessage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="font-serif text-2xl text-gold/90 tracking-[0.15em] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                            >
                                {loadingMessage}
                            </motion.h2>
                        </motion.div>
                    )}

                    {/* STATE: OPENING */}
                    {state === 'OPENING' && result && (
                        <motion.div
                            key="opening"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.8 } }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="flex items-center justify-center"
                        >
                            {/* Mandala Expansion Glow */}
                            <div className="relative flex items-center justify-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 0.3, scale: 1.5 }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="absolute w-[500px] h-[500px] bg-gold rounded-full blur-[120px] pointer-events-none mix-blend-screen"
                                />
                                <Mandala
                                    vibrationalSignature={result.vibrational_signature}
                                    hash={result.symbolic_hash}
                                    size={500}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STATE: VERBO */}
                    {state === 'VERBO' && result && (
                        <motion.div
                            key="verbo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="w-full max-w-6xl flex flex-col gap-12"
                        >
                            {/* Upper Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                {/* Coluna da Esquerda: Mandala e Identidade */}
                                <div className="lg:col-span-4 flex flex-col items-center text-center gap-8">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="relative"
                                    >
                                        {/* Background glow sutil persistente */}
                                        <div className="absolute inset-0 bg-mystic-purple/10 rounded-full blur-3xl pointer-events-none" />
                                        <Mandala
                                            vibrationalSignature={result.vibrational_signature}
                                            hash={result.symbolic_hash}
                                            size={320}
                                        />
                                    </motion.div>

                                    <div className="space-y-4">
                                        <h1 className="font-serif text-4xl text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                            {result.insight.archetype}
                                        </h1>
                                        <div className="font-mono text-[11px] text-mystic-purple/90 uppercase tracking-[0.25em] bg-glass-bg border border-glass-border px-4 py-2 rounded-full inline-block shadow-lg">
                                            {result.symbolic_hash}
                                        </div>
                                    </div>

                                    <button
                                        onClick={reset}
                                        className="mt-6 px-8 py-3 text-xs font-sans tracking-widest uppercase border border-gold/30 hover:border-gold hover:bg-gold/15 rounded-full transition-all duration-300 text-gold/70 hover:text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-sm"
                                    >
                                        Nova Transmutação
                                    </button>
                                </div>

                                {/* Coluna da Direita: Os Insights (O Verbo) */}
                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                    <RevealCard
                                        title="Visão de Papus"
                                        content={result.insight.papus_vision}
                                        delay={0.5}
                                        icon={<Eye className="w-5 h-5" />}
                                    />

                                    <RevealCard
                                        title="Sombra Junguiana"
                                        content={result.insight.jungian_shadow}
                                        delay={2.5}
                                        icon={<Brain className="w-5 h-5" />}
                                    />

                                    <div className="md:col-span-2">
                                        <RevealCard
                                            title="Síntese do Maestro"
                                            content={result.insight.maestro_synthesis}
                                            delay={4.5}
                                            icon={<Key className="w-5 h-5" />}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Chat Section */}
                            <ChatFollowUp threadId={result.symbolic_hash} />
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
