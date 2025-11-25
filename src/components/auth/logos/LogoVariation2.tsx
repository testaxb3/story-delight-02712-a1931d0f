export const LogoVariation2 = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flame-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#FFA552" />
          </linearGradient>
        </defs>
        
        {/* Brain - geometric modern style */}
        <path
          d="M25 30C25 22 31 16 38 16C42 16 45 18 47 20C49 18 52 16 56 16C63 16 69 22 69 30C69 33 68 36 66 38C68 40 69 43 69 46C69 50 66 53 62 54C62 58 59 62 55 64C53 65 50 66 47 66C46 68 44 69 41 69C38 69 36 68 35 66C32 66 29 65 27 64C23 62 20 58 20 54C16 53 13 50 13 46C13 43 14 40 16 38C14 36 13 33 13 30C13 26 15 23 18 21C20 24 22 26 25 27C25 28 25 29 25 30Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="text-foreground"
        />
        
        {/* Neural paths */}
        <line x1="30" y1="30" x2="35" y2="35" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
        <line x1="52" y1="30" x2="47" y2="35" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
        <line x1="35" y1="45" x2="40" y2="50" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
        <line x1="47" y1="45" x2="42" y2="50" stroke="currentColor" strokeWidth="2" className="text-foreground/40" />
        
        {/* Flame integrated - side style */}
        <path
          d="M65 25C65 25 68 20 68 17C68 17 67 19 66 21C66 21 68 19 69 19C69 19 67 22 66 24C66 24 68 23 69 24C69 24 66 27 63 27C60 27 57 24 57 24C57 24 58 23 60 24C60 24 59 22 59 21C59 21 60 19 62 19C62 19 60 21 60 21C60 21 61 17 63 17C63 17 63 19 63 21C63 21 64 20 65 21C65 21 65 23 65 25Z"
          fill="url(#flame-gradient-2)"
        />
      </svg>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">NEP</h2>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">System</p>
      </div>
    </div>
  );
};
