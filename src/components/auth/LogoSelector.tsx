import { LogoVariation1 } from './logos/LogoVariation1';
import { LogoVariation2 } from './logos/LogoVariation2';
import { LogoVariation3 } from './logos/LogoVariation3';

export const LogoSelector = () => {
  return (
    <div className="mb-12">
      <p className="text-center text-xs text-muted-foreground mb-6">
        Escolha uma variação da logo:
      </p>
      
      <div className="grid grid-cols-3 gap-6">
        <button 
          className="flex flex-col items-center p-4 rounded-2xl hover:bg-muted/50 transition-colors"
          onClick={() => console.log('Variation 1 selected')}
        >
          <LogoVariation1 />
          <span className="text-xs text-muted-foreground mt-3">Variação 1</span>
        </button>
        
        <button 
          className="flex flex-col items-center p-4 rounded-2xl hover:bg-muted/50 transition-colors"
          onClick={() => console.log('Variation 2 selected')}
        >
          <LogoVariation2 />
          <span className="text-xs text-muted-foreground mt-3">Variação 2</span>
        </button>
        
        <button 
          className="flex flex-col items-center p-4 rounded-2xl hover:bg-muted/50 transition-colors"
          onClick={() => console.log('Variation 3 selected')}
        >
          <LogoVariation3 />
          <span className="text-xs text-muted-foreground mt-3">Variação 3</span>
        </button>
      </div>
    </div>
  );
};
