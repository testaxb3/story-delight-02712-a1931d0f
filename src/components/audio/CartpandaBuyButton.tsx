import { useEffect, useRef } from 'react';

interface CartpandaBuyButtonProps {
  buttonId: string;
  shopUrl: string;
}

export function CartpandaBuyButton({ buttonId, shopUrl }: CartpandaBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove any existing script to force re-execution
    const existingScript = document.querySelector('script[src*="buy-button.min.js"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Wait for DOM to be ready before loading script
    const timeout = setTimeout(() => {
      const script = document.createElement('script');
      script.src = `${shopUrl}js/buy-button.min.js`;
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [shopUrl, buttonId]);

  return (
    <div 
      ref={containerRef}
      className="cartx-buy-button" 
      data-buy-button={buttonId}
      data-shop-url={shopUrl}
    />
  );
}
