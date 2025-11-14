# Exemplo de Uso - BottomNav com Ícones Lottie

## Passo a Passo Completo

### 1. Baixe os Ícones

Acesse **https://lottiefiles.com/** e busque:

- **"home"** → Salve como `home-icon.json`
- **"book"** ou **"document"** → Salve como `scripts-icon.json`
- **"gift"** ou **"present"** → Salve como `bonus-icon.json`
- **"video"** ou **"play"** → Salve como `video-icon.json`
- **"user"** ou **"profile"** → Salve como `profile-icon.json`

Salve todos em: `src/assets/lottie/`

### 2. Importe no BottomNav.tsx

Adicione no topo do arquivo `BottomNav.tsx`:

```tsx
import { LottieIcon } from '@/components/LottieIcon';
import homeAnimation from '@/assets/lottie/home-icon.json';
import scriptsAnimation from '@/assets/lottie/scripts-icon.json';
import bonusAnimation from '@/assets/lottie/bonus-icon.json';
import videoAnimation from '@/assets/lottie/video-icon.json';
import profileAnimation from '@/assets/lottie/profile-icon.json';
```

### 3. Substitua os Ícones SVG

Dentro do `navItems.map()`, substitua:

```tsx
// ANTES (SVG estático):
<Icon isActive={isActive} />

// DEPOIS (Lottie animado):
<LottieIcon
  animationData={icon} // Passa a animação do navItem
  isActive={isActive}
  size={30}
  loop={true}
  autoplay={isActive}
  speed={1.5}
/>
```

### 4. Atualize o Array navItems

```tsx
const navItems = [
  {
    icon: homeAnimation,
    label: 'Home',
    path: '/',
    gradient: 'from-purple-500 to-blue-500'
  },
  {
    icon: scriptsAnimation,
    label: 'Scripts',
    path: '/scripts',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    icon: bonusAnimation,
    label: 'Bônus',
    path: '/bonuses',
    gradient: 'from-amber-500 to-red-500'
  },
  {
    icon: videoAnimation,
    label: 'Vídeos',
    path: '/videos',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: profileAnimation,
    label: 'Perfil',
    path: '/profile',
    gradient: 'from-orange-500 to-amber-500'
  },
];
```

### 5. Código Completo do Ícone Animado

Substitua o bloco do ícone por:

```tsx
{/* Icon container com animação Lottie */}
<motion.div
  className="relative flex items-center justify-center w-[30px] h-[30px]"
  initial={false}
  animate={{
    scale: isActive ? 1.1 : 0.95,
    y: isActive ? -3 : 0,
  }}
  transition={{
    type: "spring",
    stiffness: 600,
    damping: 25,
    mass: 0.8
  }}
>
  {/* Glow effect quando ativo */}
  {isActive && (
    <motion.div
      className={cn(
        "absolute inset-0 rounded-full bg-gradient-to-r blur-xl opacity-50",
        gradient
      )}
      animate={{
        scale: [0.8, 1.4, 0.8],
        opacity: [0.2, 0.6, 0.2]
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )}

  {/* Lottie Icon */}
  <div className="relative z-10">
    <LottieIcon
      animationData={icon}
      isActive={isActive}
      size={30}
      loop={true}
      autoplay={isActive}
      speed={1.5}
    />
  </div>
</motion.div>
```

## Resultado Final

Você terá ícones que:
- ✅ Animam suavemente quando ativos
- ✅ Param quando inativos
- ✅ Tem glow effect com gradiente
- ✅ Integram perfeitamente com as animações Telegram-style
- ✅ São leves e performáticos

## Customização de Cores

Se quiser mudar as cores do Lottie para combinar com o gradiente:

```tsx
import { useCustomLottieColors } from '@/components/LottieIcon';

// No componente:
const customBonus = useCustomLottieColors(bonusAnimation, {
  fillColor: '#F59E0B',
  strokeColor: '#EF4444'
});

// Depois use customBonus no lugar de bonusAnimation
```

## Dicas

- **Velocidade**: Ajuste `speed={1.5}` para mais rápido ou `speed={0.5}` para mais lento
- **Loop**: `loop={true}` faz animação contínua, `loop={false}` anima uma vez
- **Autoplay**: `autoplay={isActive}` só anima quando tab está ativa
