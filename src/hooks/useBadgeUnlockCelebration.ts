/**
 * BADGE UNLOCK CELEBRATION HOOK
 * Zero-dependency celebration using Web Animations API + native vibration
 * Bundle size: 0kb (vs 32kb for canvas-confetti)
 */

import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { BadgeUnlockEvent } from '@/types/achievements';

interface ParticleConfig {
  count: number;
  colors: string[];
  duration: number;
}

const createParticle = (
  container: HTMLElement,
  color: string,
  angle: number,
  velocity: number
): HTMLElement => {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    left: 50%;
    top: 50%;
  `;
  container.appendChild(particle);

  const radians = (angle * Math.PI) / 180;
  const vx = Math.cos(radians) * velocity;
  const vy = Math.sin(radians) * velocity;

  particle.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy}px) scale(0.5)`, opacity: 0.5, offset: 0.7 },
      { transform: `translate(${vx * 1.5}px, ${vy * 1.5}px) scale(0)`, opacity: 0 }
    ],
    {
      duration: 1200,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  ).onfinish = () => {
    particle.remove();
  };

  return particle;
};

const triggerConfettiExplosion = (config: ParticleConfig): void => {
  const container = document.createElement('div');
  container.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 9999;';
  document.body.appendChild(container);

  const angleStep = 360 / config.count;
  const velocityBase = 150;

  for (let i = 0; i < config.count; i++) {
    const angle = i * angleStep;
    const velocity = velocityBase + Math.random() * 100;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    createParticle(container, color, angle, velocity);
  }

  setTimeout(() => {
    container.remove();
  }, config.duration);
};

const triggerNativeVibration = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 100, 50, 100, 100]);
  }
};

export const useBadgeUnlockCelebration = () => {
  const isPlayingRef = useRef(false);

  const celebrate = useCallback((event: BadgeUnlockEvent) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    const { badge } = event;

    triggerConfettiExplosion({
      count: 40,
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      duration: 1500
    });

    triggerNativeVibration();

    toast.success(`🏆 ${badge.name}`, {
      description: badge.description,
      duration: 4000,
      className: 'font-semibold'
    });

    setTimeout(() => {
      isPlayingRef.current = false;
    }, 2000);
  }, []);

  return { celebrate };
};
