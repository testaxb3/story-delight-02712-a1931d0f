-- Corrigir políticas de user_badges para prevenir INSERT por usuários
-- Remover política ALL que permite INSERT
DROP POLICY IF EXISTS "Users can manage their badges" ON user_badges;

-- Criar política SELECT segura: usuários podem ver seus próprios badges
CREATE POLICY "Users can view own badges"
ON user_badges FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Nota: Nenhuma política INSERT/UPDATE/DELETE para usuários
-- Badges são concedidos apenas por triggers/sistema