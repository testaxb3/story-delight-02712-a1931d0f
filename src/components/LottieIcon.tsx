import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';

interface LottieIconProps {
  animationData: any;
  isActive?: boolean;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  // Gradient colors (from -> to)
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * LottieIcon Component
 *
 * Wrapper para ícones Lottie com suporte a gradientes e controle de animação
 *
 * @example
 * ```tsx
 * import bonusAnimation from '@/assets/lottie/bonus-gift.json';
 *
 * <LottieIcon
 *   animationData={bonusAnimation}
 *   isActive={true}
 *   size={30}
 *   gradientFrom="#F59E0B"
 *   gradientTo="#EF4444"
 * />
 * ```
 */
export function LottieIcon({
  animationData,
  isActive = false,
  size = 30,
  loop = true,
  autoplay = true,
  speed = 1,
  className = '',
  gradientFrom,
  gradientTo,
}: LottieIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Controla play/pause baseado no estado ativo
  useEffect(() => {
    if (!lottieRef.current) return;

    if (isActive && autoplay) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
      lottieRef.current.goToAndStop(0, true); // Volta ao início
    }
  }, [isActive, autoplay]);

  // Define velocidade da animação
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        // Aplica gradiente se fornecido
        ...(gradientFrom && gradientTo && {
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          // Nota: alguns ícones Lottie não suportam gradiente via CSS
          // Para esses casos, edite as cores diretamente no JSON do Lottie
        }),
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop && isActive}
        autoplay={false} // Controlamos manualmente via useEffect
        style={{ width: size, height: size }}
      />
    </div>
  );
}

/**
 * Hook para customizar cores de um ícone Lottie
 *
 * @example
 * ```tsx
 * const customizedAnimation = useCustomLottieColors(bonusAnimation, {
 *   fillColor: '#F59E0B',
 *   strokeColor: '#EF4444'
 * });
 * ```
 */
export function useCustomLottieColors(
  animationData: any,
  colors: {
    fillColor?: string;
    strokeColor?: string;
  }
) {
  if (!colors.fillColor && !colors.strokeColor) {
    return animationData;
  }

  // Clona o objeto para não modificar o original
  const customData = JSON.parse(JSON.stringify(animationData));

  // Função recursiva para mudar cores em todas as camadas
  const updateColors = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach(updateColors);
    } else if (obj && typeof obj === 'object') {
      // Atualiza cores de preenchimento
      if (colors.fillColor && obj.c && Array.isArray(obj.c.k)) {
        // Converte hex para RGB normalizado [0-1]
        const rgb = hexToRgb(colors.fillColor);
        if (rgb) {
          obj.c.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];
        }
      }

      // Atualiza cores de stroke
      if (colors.strokeColor && obj.s && Array.isArray(obj.s.k)) {
        const rgb = hexToRgb(colors.strokeColor);
        if (rgb) {
          obj.s.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];
        }
      }

      // Recursão em todos os valores
      Object.values(obj).forEach(updateColors);
    }
  };

  updateColors(customData);
  return customData;
}

// Helper: Converte hex para RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
