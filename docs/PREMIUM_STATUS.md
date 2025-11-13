# Sistema de Status Premium - NEP System

## Visão Geral

O NEP System utiliza um sistema de status de assinatura (`subscription_status`) para gerenciar o acesso dos usuários a funcionalidades premium.

## Decisão de Design

**Todos os usuários iniciais são PREMIUM por padrão.**

Esta decisão foi tomada porque:

1. **Modelo de Negócio**: O NEP System é um produto premium que será vendido por $37 (VSL). Todos os usuários que acessam a aplicação já pagaram ou estão em um período de trial.
2. **Simplicidade**: Não há necessidade de um sistema complexo de paywall ou verificação de pagamento nesta fase inicial.
3. **Escalabilidade**: O campo `subscription_status` foi adicionado ao banco de dados para permitir futuras implementações de diferentes tiers de assinatura (free, premium, trial) sem necessidade de refatoração.

## Estrutura do Banco de Dados

### Tabela: `profiles`

```sql
subscription_status TEXT DEFAULT 'premium' CHECK (subscription_status IN ('free', 'premium', 'trial'))
subscription_expires_at TIMESTAMP WITH TIME ZONE
```

### Valores Possíveis de `subscription_status`

- **`premium`**: Usuário tem acesso completo a todas as funcionalidades
- **`trial`**: Usuário está em período de trial (verificar `subscription_expires_at`)
- **`free`**: Usuário tem acesso limitado (para futuras implementações)

## Implementação Atual

### Criação de Perfil

Quando um novo usuário é criado via `saveChildProfile()`, o `subscription_status` é automaticamente definido como `'premium'`.

```typescript
const profileUpsertPayload = {
  id: user.id,
  subscription_status: 'premium', // Todos os usuários iniciais são premium
};
```

### Verificação de Status

Para verificar se um usuário é premium no frontend:

```typescript
// Buscar o status do usuário
const { data: profile } = await supabase
  .from('profiles')
  .select('subscription_status')
  .eq('id', user.id)
  .single();

const isPremium = profile?.subscription_status === 'premium';
```

## Futuras Expansões

Quando o produto crescer e houver necessidade de diferentes tiers de assinatura:

1. **Adicionar coluna `stripe_customer_id`** para integração com Stripe
2. **Criar tabela `subscriptions`** para rastrear histórico de assinatura
3. **Implementar webhook de Stripe** para atualizar `subscription_status` automaticamente
4. **Adicionar verificação de `subscription_expires_at`** para trials

## Notas de Segurança

- O status premium é armazenado no banco de dados e verificado no servidor (via RLS)
- Não confiar apenas no frontend para verificar status premium
- Sempre validar permissões no backend antes de conceder acesso a funcionalidades premium

