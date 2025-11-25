export const LogoVariation1 = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flame-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#FFA552" />
          </linearGradient>
        </defs>
        
        {/* Brain outline - minimalist style */}
        <path
          d="M40 15C30 15 22 23 22 33C22 35 22.5 37 23 39C21 40 20 42 20 45C20 48 22 50 24 51C24 54 25 57 27 59C29 61 32 62 35 62C36 64 38 65 40 65C42 65 44 64 45 62C48 62 51 61 53 59C55 57 56 54 56 51C58 50 60 48 60 45C60 42 59 40 57 39C57.5 37 58 35 58 33C58 23 50 15 40 15Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-foreground"
        />
        
        {/* Brain details - left hemisphere */}
        <path
          d="M28 28C28 28 30 30 32 30C34 30 35 28 35 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/60"
        />
        <path
          d="M26 38C26 38 28 40 30 40C32 40 33 38 33 38"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/60"
        />
        
        {/* Brain details - right hemisphere */}
        <path
          d="M45 28C45 28 47 30 49 30C51 30 52 28 52 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/60"
        />
        <path
          d="M47 38C47 38 49 40 51 40C53 40 54 38 54 38"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/60"
        />
        
        {/* Flame on top - stylized */}
        <path
          d="M40 10C40 10 38 5 36 5C36 5 37 8 37 10C37 10 35 8 34 8C34 8 36 11 37 13C37 13 35 12 34 13C34 13 37 16 40 16C43 16 46 13 46 13C46 13 45 12 43 13C43 13 44 11 44 10C44 10 43 8 41 8C41 8 43 10 43 10C43 10 42 5 40 5C40 5 40 8 40 10Z"
          fill="url(#flame-gradient-1)"
        />
      </svg>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">NEP</h2>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">System</p>
      </div>
    </div>
  );
};
