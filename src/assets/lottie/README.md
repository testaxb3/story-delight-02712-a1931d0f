# Como Usar Ícones Lottie

## Passo 1: Baixar Ícones

### LottieFiles (Recomendado)
1. Acesse: https://lottiefiles.com/
2. Busque o ícone desejado (ex: "gift", "home", "video", etc)
3. Clique no ícone
4. Clique em "Download" → "Lottie JSON"
5. Salve o arquivo `.json` nesta pasta (`src/assets/lottie/`)

### Lordicon
1. Acesse: https://lordicon.com/
2. Escolha o ícone
3. Download como "Lottie JSON"
4. Salve nesta pasta

## Passo 2: Renomear Arquivos

Renomeie os arquivos para nomes descritivos:
- `home-icon.json`
- `bonus-gift.json`
- `video-play.json`
- `scripts-book.json`
- `profile-user.json`

## Passo 3: Usar no Código

```tsx
import Lottie from 'lottie-react';
import bonusAnimation from '@/assets/lottie/bonus-gift.json';

const BonusIcon = ({ isActive }: { isActive: boolean }) => (
  <Lottie
    animationData={bonusAnimation}
    loop={isActive}
    autoplay={isActive}
    style={{ width: 30, height: 30 }}
  />
);
```

## Exemplo Completo

Veja o componente `LottieIcon.tsx` para um exemplo de como aplicar gradientes e controlar cores.

## Dicas

- **Performance**: Ícones Lottie são leves (5-20kb cada)
- **Cores**: Alguns ícones permitem mudar cores via CSS
- **Tamanho**: Use `style={{ width, height }}` para controlar tamanho
- **Loop**: Use `loop={true}` para animação contínua
- **Autoplay**: Use `autoplay={true}` para iniciar automaticamente
