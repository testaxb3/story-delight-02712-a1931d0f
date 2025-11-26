import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Slider } from './slider';

type HapticSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export const HapticSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  HapticSliderProps
>(({ onValueChange, min = 0, max = 100, step = 1, className, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const isDraggingRef = React.useRef(false);
  const lastHapticTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create haptic elements hidden
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `haptic-slider-${Math.random().toString(36).substr(2, 9)}`;
    input.setAttribute("switch", "");
    input.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none";
    container.appendChild(input);
    inputRef.current = input;

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none";
    container.appendChild(label);
    labelRef.current = label;

    // Handle touch events on the container
    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      // Trigger haptic on start
      label.click();
    };

    const handleTouchEnd = () => {
      if (isDraggingRef.current) {
        // Trigger haptic on end
        label.click();
      }
      isDraggingRef.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      if (input.parentNode) container.removeChild(input);
      if (label.parentNode) container.removeChild(label);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ touchAction: 'none' }}>
      <Slider
        ref={ref}
        min={min}
        max={max}
        step={step}
        className={className}
        {...props}
        onValueChange={onValueChange}
      />
    </div>
  );
});

HapticSlider.displayName = 'HapticSlider';
