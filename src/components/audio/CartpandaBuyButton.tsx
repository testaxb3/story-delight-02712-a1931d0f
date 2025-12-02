import { useEffect, useRef } from 'react';

interface CartpandaBuyButtonProps {
  buttonId: string;
  shopUrl: string;
}

export function CartpandaBuyButton({ buttonId, shopUrl }: CartpandaBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Cartpanda script if not already loaded
    const existingScript = document.querySelector('script[src*="buy-button.min.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `${shopUrl}js/buy-button.min.js`;
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }

    return () => {
      // Optional: cleanup if needed
    };
  }, [shopUrl]);

  return (
    <div 
      ref={containerRef}
      className="cartx-buy-button" 
      data-buy-button={buttonId}
      data-shop-url={shopUrl}
    />
  );
}
