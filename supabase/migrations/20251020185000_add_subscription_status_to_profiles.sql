-- Adicionar coluna subscription_status à tabela profiles
-- Esta coluna permite controlar o status de assinatura de cada usuário
-- Valores possíveis: 'free', 'premium', 'trial'
-- Padrão: 'premium' (todos os usuários atuais são premium)

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'premium' CHECK (subscription_status IN ('free', 'premium', 'trial'));

-- Adicionar coluna subscription_expires_at para controlar expiração de trials
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Comentário explicativo no código
COMMENT ON COLUMN public.profiles.subscription_status IS 'Status de assinatura do usuário. Todos os usuários iniciais são premium por padrão.';
COMMENT ON COLUMN public.profiles.subscription_expires_at IS 'Data de expiração da assinatura (para trials). NULL se assinatura não expira.';

