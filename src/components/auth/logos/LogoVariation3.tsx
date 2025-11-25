export const LogoVariation3 = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flame-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#FFA552" />
          </linearGradient>
        </defs>
        
        {/* Brain - abstract circular style */}
        <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground" />
        
        {/* Left hemisphere curves */}
        <path
          d="M20 35C20 35 25 30 30 32C35 34 33 40 28 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/70"
        />
        <path
          d="M22 45C22 45 27 42 30 44C33 46 32 50 28 52"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/70"
        />
        
        {/* Right hemisphere curves */}
        <path
          d="M60 35C60 35 55 30 50 32C45 34 47 40 52 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/70"
        />
        <path
          d="M58 45C58 45 53 42 50 44C47 46 48 50 52 52"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/70"
        />
        
        {/* Central flame - integrated in center */}
        <path
          d="M40 35C40 35 38 28 36 28C36 28 37 32 37 35C37 35 35 32 34 32C34 32 36 36 37 39C37 39 35 38 34 39C34 39 37 43 40 43C43 43 46 39 46 39C46 39 45 38 43 39C43 39 44 36 44 35C44 35 43 32 41 32C41 32 43 35 43 35C43 35 42 28 40 28C40 28 40 32 40 35Z"
          fill="url(#flame-gradient-3)"
        />
        
        {/* Connecting line - center division */}
        <line x1="40" y1="20" x2="40" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/40" />
        <line x1="40" y1="43" x2="40" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/40" />
      </svg>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">NEP</h2>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">System</p>
      </div>
    </div>
  );
};
