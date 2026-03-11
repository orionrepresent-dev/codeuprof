import { useState, useCallback, useEffect } from 'react';

export type SymbolicState = 'IDLE' | 'INCUBATION' | 'OPENING' | 'VERBO';

export interface ArchetypalInsight {
    archetype: string;
    papus_vision: string;
    jungian_shadow: string;
    maestro_synthesis: string;
}

export interface AnalysisResult {
    vibrational_signature: number;
    symbolic_hash: string;
    insight: ArchetypalInsight;
}

export function useSymbolicEngine() {
    const [state, setState] = useState<SymbolicState>('IDLE');
    const [loadingMessage, setLoadingMessage] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('symbolic_identity');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setResult(parsed);
                setState('VERBO');
            } catch (e) {
                console.error('Failed to parse stored identity', e);
            }
        }
    }, []);

    const startRevelation = useCallback(async (userData: any) => {
        setState('INCUBATION');

        const messages = [
            "Sintonizando Arcanos de Papus...",
            "Mapeando Sombra Junguiana...",
            "O Verbo se faz carne digital...",
            "Calculando Assinatura Vibracional..."
        ];
        let msgIdx = 0;
        setLoadingMessage(messages[0]);
        const msgInterval = setInterval(() => {
            msgIdx = (msgIdx + 1) % messages.length;
            setLoadingMessage(messages[msgIdx]);
        }, 1800);

        try {
            // Simulate API call delay for the full incubation experience
            await new Promise(r => setTimeout(r, 6000));

            let hash = "hash_xxx";
            let analysisData = null;

            try {
                const hashRes = await fetch('http://localhost:8000/codeuprof/api/v1/generate-hash', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });

                let hashData = null;
                if (hashRes.ok) {
                    hashData = await hashRes.json();
                    hash = hashData.symbolic_hash || hash;
                }

                if (hashData) {
                    const analysisRes = await fetch('http://localhost:8000/codeuprof/api/v1/deep-analysis', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ hash_data: hashData, thread_id: hash }),
                    });
                    if (analysisRes.ok) {
                        analysisData = await analysisRes.json();
                    }
                }
            } catch (e) {
                console.warn("Backend apis not active, using fallback simulation.");
            }

            clearInterval(msgInterval);

            const finalResult: AnalysisResult = analysisData ? {
                vibrational_signature: analysisData.vibrational_signature || 4,
                symbolic_hash: hash,
                insight: analysisData.insight || {
                    archetype: "O Imperador",
                    papus_vision: "Arquétipo do poder temporal, da razão e da estrutura. A matéria é dominada pelo espírito e pela vontade.",
                    jungian_shadow: "A necessidade compulsiva de controle pode gerar rigidez e despotismo intelectual ou emocional.",
                    maestro_synthesis: "Sua estrutura é sua força, mas a flexibilidade é o seu norte. Utilize o controle para libertar, não para aprisionar."
                }
            } : {
                vibrational_signature: 4,
                symbolic_hash: "0x7F_ARC_IV_93",
                insight: {
                    archetype: "O Imperador",
                    papus_vision: "A Pedra Cúbica. A realização do espírito na matéria através da autoridade, estabilidade e vontade consciente.",
                    jungian_shadow: "O regimento estrito e o medo do caos que reprime a intuição e a energia emocional criativa.",
                    maestro_synthesis: "Você é um construtor de mundos. Seu desafio é integrar o caos sem perder a firmeza de seu trono interno."
                }
            };

            setResult(finalResult);
            localStorage.setItem('symbolic_identity', JSON.stringify(finalResult));

            setState('OPENING');
            setTimeout(() => {
                setState('VERBO');
            }, 3500); // 3.5 seconds of Opening animation 

        } catch (error) {
            clearInterval(msgInterval);
            console.error(error);
            setState('IDLE');
        }
    }, []);

    const reset = () => {
        localStorage.removeItem('symbolic_identity');
        setResult(null);
        setState('IDLE');
    };

    return { state, loadingMessage, result, startRevelation, reset };
}
