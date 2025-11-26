import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Slider } from './slider';
import { useHaptic } from '@/hooks/useHaptic';

type HapticSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export const HapticSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  HapticSliderProps
>(({ onValueChange, ...props }, ref) => {
  const { triggerHaptic } = useHaptic();
  const lastValueRef = React.useRef<number | null>(null);
  const isDraggingRef = React.useRef(false);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
    lastValueRef.current = props.value?.[0] ?? null;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleValueChange = (value: number[]) => {
    // Só dispara haptic se estiver arrastando E o valor mudou
    if (isDraggingRef.current && lastValueRef.current !== null) {
      const step = props.step || 1;
      const currentStep = Math.round(value[0] / step);
      const lastStep = Math.round(lastValueRef.current / step);
      
      if (currentStep !== lastStep) {
        triggerHaptic('light');
        lastValueRef.current = value[0];
      }
    }
    
    onValueChange?.(value);
  };

  return (
    <div 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Slider
        ref={ref}
        {...props}
        onValueChange={handleValueChange}
      />
    </div>
  );
});

HapticSlider.displayName = 'HapticSlider';
