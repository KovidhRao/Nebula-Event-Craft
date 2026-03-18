// Modern Event Management Platform - Landing Page

import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Users, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-neon/10 blur-2xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center animate-fadeInUp">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent animate-glow">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
          Event Nexus
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          The future of event management is here. Create, discover, and manage events with powerful cloud-based tools.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">User Portal</h3>
            <p className="text-muted-foreground text-sm">Discover amazing events and connect with communities</p>
          </div>
          <div className="glass-card text-center">
            <Calendar className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Event Creation</h3>
            <p className="text-muted-foreground text-sm">Create and manage events with powerful tools</p>
          </div>
          <div className="glass-card text-center">
            <BarChart3 className="w-8 h-8 text-neon mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
            <p className="text-muted-foreground text-sm">Track performance and gain insights</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/role-selection")}
          size="lg"
          className="primary-glow text-lg px-8 py-6 group"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 smooth-transition" />
        </Button>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-glass-border/20">
          <p className="text-sm text-muted-foreground">
            Experience the next generation of event management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
