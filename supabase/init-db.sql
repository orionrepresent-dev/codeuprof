-- SQL Initialization Script for Supabase / PostgreSQL
-- Criar schemas necessários para produção

-- 1. Cria a tabela users_codes
CREATE TABLE IF NOT EXISTS users_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    symbolic_hash VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indice para buscas rápidas do hash
CREATE INDEX IF NOT EXISTS idx_users_codes_hash ON users_codes(symbolic_hash);

-- 2. Cria a tabela analysis_history (para guardar as saídas do Grafo LangGraph)
CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_code_id UUID REFERENCES users_codes(id) ON DELETE CASCADE,
    junguiano_json JSONB,
    papus_json JSONB,
    maestro_json JSONB,
    synthesized_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analysis_history_user ON analysis_history(user_code_id);

-- 3. Cria a tabela logs_vibracionais (para acompanhar a evolução/interações do usuário no tempo)
CREATE TABLE IF NOT EXISTS logs_vibracionais (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_code_id UUID REFERENCES users_codes(id) ON DELETE CASCADE,
    interaction_type VARCHAR(100) NOT NULL, -- Exemplo: 'UPDATE_MANDALA', 'DEEP_DIVE', 'REFLECTION'
    old_state JSONB, -- Estado antes da interação
    new_state JSONB,    -- Estado pós interação
    vibrational_shift_note TEXT, -- Resumo breve caso tenha ocorrido mudança no "tom" da mandala
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_vibracionais_user ON logs_vibracionais(user_code_id);
CREATE INDEX IF NOT EXISTS idx_logs_vibracionais_date ON logs_vibracionais(logged_at);

-- Role/Security Policies (Sugestão RLS - Row Level Security, se utilizando Dashboard)
-- Lembre-se de ativar o RLS caso a chamada saia de um cliente com Auth ativado.
-- ALTER TABLE users_codes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE logs_vibracionais ENABLE ROW LEVEL SECURITY;
