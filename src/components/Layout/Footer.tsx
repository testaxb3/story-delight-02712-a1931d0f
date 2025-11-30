import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">NEP System</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Evidence-based parenting strategies powered by neuroscience. Supporting parents of children with INTENSE, DEFIANT, DISTRACTED, and UNIVERSAL brain profiles.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/refund-policy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Refund Policy
              </Link>
            </nav>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@nepsystem.pro</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NEP System. All rights reserved.</p>
          <p className="text-xs">
            Content based on research by Dr. Ross Greene, Dr. Russell Barkley, and Dr. Daniel Siegel
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground/30 mt-2 text-center">
          Verification code: OS7K3L
        </p>
      </div>
    </footer>
  );
}
