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
  const isDraggingRef = React.useRef(false);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
    triggerHaptic('light');
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      triggerHaptic('light');
    }
    isDraggingRef.current = false;
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
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
