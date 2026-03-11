"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'maestro';
    content: string;
}

export function ChatFollowUp({ threadId }: { threadId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/codeuprof/api/v1/chat-followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    thread_id: threadId,
                    message: userMsg.content
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const maestroMsg: Message = { id: (Date.now() + 1).toString(), role: 'maestro', content: data.response };
                setMessages(prev => [...prev, maestroMsg]);
            } else {
                const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'maestro', content: "O éter está nublado. Não consegui sintonizar a resposta." };
                setMessages(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            console.warn("Backend apis not active, using mock response.");
            // Fallback for UI Seer Testing
            setTimeout(() => {
                const mockMsg: Message = { id: (Date.now() + 1).toString(), role: 'maestro', content: "As brumas arquetípicas ressoam suas palavras: '" + userMsg.content + "'. A reflexão é o início da iluminação verdadeira." };
                setMessages(prev => [...prev, mockMsg]);
                setIsLoading(false);
            }, 1500);
            return;
        } finally {
            setIsLoading(false);
        }
    };

    // Typing effect for the last maestro message
    const TypingMessage = ({ text }: { text: string }) => {
        const [displayed, setDisplayed] = useState('');

        useEffect(() => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    setDisplayed(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 20); // Fast typing effect
            return () => clearInterval(timer);
        }, [text]);

        return <span>{displayed}</span>;
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 mb-24 flex flex-col bg-transparent border border-gold/20 rounded-2xl shadow-[0_0_30px_rgba(40,10,60,0.3)] overflow-hidden">
            <div className="p-4 border-b border-gold/10 bg-black/20 backdrop-blur-md flex items-center gap-3">
                <Sparkles className="text-gold w-5 h-5" />
                <h3 className="font-serif text-gold tracking-widest text-sm uppercase">Diálogo com o Maestro</h3>
            </div>

            <div className="flex-1 p-6 overflow-y-auto max-h-[400px] min-h-[300px] flex flex-col gap-6 backdrop-blur-sm bg-black/10">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-mystic-purple/50 font-serif text-sm italic">
                        O Maestro aguarda seu questionamento...
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${msg.role === 'user'
                                    ? 'bg-mystic-purple/10 border border-mystic-purple/30 text-white font-sans text-sm shadow-[0_0_15px_rgba(138,43,226,0.1)]'
                                    : 'bg-transparent border border-gold/20 text-[#D8B4E2] font-serif tracking-wide text-lg shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]'
                                }`}>
                                {msg.role === 'maestro' && idx === messages.length - 1 ? (
                                    <TypingMessage text={msg.content} />
                                ) : (
                                    <span>{msg.content}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-transparent border border-gold/20 text-[#D8B4E2] font-serif tracking-wide flex items-center gap-2">
                                <span className="animate-pulse">Sintonizando</span>
                                <span className="flex gap-1">
                                    <span className="animate-bounce delay-75">.</span>
                                    <span className="animate-bounce delay-150">.</span>
                                    <span className="animate-bounce delay-300">.</span>
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gold/10 bg-black/30 backdrop-blur-md">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="O que deseja revelar, viajante?"
                        className="w-full bg-transparent border-0 border-b border-mystic-purple/30 focus:border-gold px-4 py-3 text-white font-sans text-sm focus:outline-none transition-colors duration-300 placeholder:text-mystic-purple/40"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 text-mystic-purple/70 hover:text-gold disabled:opacity-50 disabled:hover:text-mystic-purple/70 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
