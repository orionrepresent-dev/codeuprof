"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mandala } from '@/components/Mandala';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
    id: number;
    symbolic_hash: string;
    natal_arcana: string;
    insight: any;
    created_at: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('symbolic_identity');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.symbolic_hash) {
                    fetchHistory(parsed.symbolic_hash);
                    return;
                }
            } catch (e) {
                console.error('Failed to parse symbolic identity', e);
            }
        }
        setLoading(false);
    }, []);

    const fetchHistory = async (hash: string) => {
        try {
            const res = await fetch(`http://localhost:8000/codeuprof/api/v1/user/history?symbolic_hash=${hash}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data.data || []);
            } else {
                setHistory(getMockHistory(hash));
            }
        } catch (e) {
            console.warn("Backend not active, using mock history.");
            setHistory(getMockHistory(hash));
        } finally {
            setLoading(false);
        }
    };

    const getMockHistory = (hash: string) => [
        {
            id: 1,
            symbolic_hash: hash,
            natal_arcana: "O Imperador",
            insight: { archetype: "O Imperador", maestro_synthesis: "Você é um construtor de mundos. Seu desafio é integrar o caos sem perder a firmeza de seu trono interno." },
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            symbolic_hash: hash + "_old",
            natal_arcana: "A Força",
            insight: { archetype: "A Força", maestro_synthesis: "Domine seu instinto não com a força da espada, mas com a persuasão do afeto." },
            created_at: new Date(Date.now() - 86400000).toISOString()
        }
    ];

    const handleSelectHistory = (item: HistoryItem) => {
        // Re-construct the identity payload to update the main page
        const restoredIdentity = {
            vibrational_signature: item.insight.archetype === "O Imperador" ? 4 : 8,
            symbolic_hash: item.symbolic_hash,
            insight: item.insight
        };
        localStorage.setItem('symbolic_identity', JSON.stringify(restoredIdentity));
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen w-full relative bg-background text-foreground overflow-x-hidden font-sans">
            <div className="absolute inset-0 bg-grain pointer-events-none z-50"></div>

            <main className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 text-mystic-purple/70 hover:text-gold transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="font-serif text-3xl text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-3">
                            <Clock className="w-6 h-6" /> Registros Akáshicos
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="animate-pulse flex items-center gap-3 text-gold/70 font-serif">
                            <Sparkles className="w-5 h-5" /> Consultando os pergaminhos...
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center gap-4">
                        <div className="w-24 h-24 rounded-full border border-mystic-purple/20 flex items-center justify-center bg-black/20">
                            <Clock className="w-10 h-10 text-mystic-purple/50" />
                        </div>
                        <h2 className="text-xl font-serif text-gold/80">Nenhum rastro temporal encontrado</h2>
                        <p className="text-mystic-purple/60 max-w-md">Para acessar seus registros akáshicos, você deve primeiro passar por uma Iniciação Hermética no Dashboard.</p>
                        <Link href="/dashboard" className="mt-8 px-6 py-2 border border-gold/30 hover:border-gold hover:bg-gold/10 text-gold rounded-full transition-colors text-sm font-medium tracking-wide">
                            Iniciar Jornada
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {history.map((item, i) => (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleSelectHistory(item)}
                                className="group flex flex-col bg-black/20 border border-gold/10 hover:border-gold/50 rounded-2xl p-6 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all text-left relative overflow-hidden h-full"
                            >
                                {/* Background glow */}
                                <div className="absolute inset-0 bg-mystic-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex-1 flex flex-col items-center justify-center py-6 mb-4 relative z-10 w-full border-b border-mystic-purple/20">
                                    <div className="relative w-32 h-32 flex items-center justify-center pointer-events-none">
                                        <Mandala size={120} hash={item.symbolic_hash} vibrationalSignature={item.insight.archetype === "O Imperador" ? 4 : 8} />
                                    </div>
                                    <h3 className="font-serif mt-4 text-xl text-gold group-hover:scale-105 transition-transform">{item.insight.archetype}</h3>
                                </div>

                                <div className="relative z-10 w-full space-y-3">
                                    <div className="flex items-center justify-between text-xs text-mystic-purple/50">
                                        <span className="font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                                        <span className="uppercase tracking-widest">{item.natal_arcana}</span>
                                    </div>
                                    <p className="text-sm text-mystic-purple/80 line-clamp-3">
                                        {item.insight.maestro_synthesis}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
