import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Slider } from './slider';
import { useHaptic } from '@/hooks/useHaptic';

type HapticSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export const HapticSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  HapticSliderProps
>(({ onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const { triggerHaptic } = useHaptic();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lastStepRef = React.useRef<number | null>(null);
  const isDraggingRef = React.useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const value = min + percent * (max - min);
      lastStepRef.current = Math.round(value / step);
      triggerHaptic('light');
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const value = min + percent * (max - min);
    const currentStep = Math.round(value / step);

    if (lastStepRef.current !== null && currentStep !== lastStepRef.current) {
      triggerHaptic('light');
      lastStepRef.current = currentStep;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    lastStepRef.current = null;
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <Slider
        ref={ref}
        min={min}
        max={max}
        step={step}
        {...props}
        onValueChange={onValueChange}
      />
    </div>
  );
});

HapticSlider.displayName = 'HapticSlider';
