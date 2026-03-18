import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-neon/10 blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        {/* Main glassmorphism card */}
        <div className="glass-card text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent animate-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Event Nexus
              </h1>
              <p className="text-muted-foreground text-lg">
                Choose your access level to continue
              </p>
            </div>
          </div>

          {/* Role selection buttons */}
          <div className="space-y-4">
            <div 
              className={`relative group cursor-pointer transition-all duration-300 ${
                hoveredRole === 'user' ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredRole('user')}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleRoleSelect('user')}
            >
              <div className="glass-card border-2 border-transparent group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20 smooth-transition">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 smooth-transition">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-foreground">User Access</h3>
                    <p className="text-muted-foreground text-sm">Discover and join events</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`relative group cursor-pointer transition-all duration-300 ${
                hoveredRole === 'admin' ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredRole('admin')}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleRoleSelect('admin')}
            >
              <div className="glass-card border-2 border-transparent group-hover:border-accent/30 group-hover:shadow-lg group-hover:shadow-accent/20 smooth-transition">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-accent/20 group-hover:bg-accent/30 smooth-transition">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-foreground">Admin Access</h3>
                    <p className="text-muted-foreground text-sm">Manage events and analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-glass-border/20">
            <p className="text-xs text-muted-foreground">
              Secure cloud-based event management platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;