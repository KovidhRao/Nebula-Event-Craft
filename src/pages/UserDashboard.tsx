import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Bell, 
  User, 
  Calendar, 
  MapPin, 
  LogOut,
  Settings,
  Bookmark,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EventCard from "@/components/EventCard";
import { toast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notifications, setNotifications] = useState(3);

  // Mock events data
  const events = [
    {
      id: "1",
      title: "Tech Innovation Summit 2024",
      description: "Join industry leaders for the latest in technology trends, AI, and digital transformation.",
      date: "2024-02-15",
      time: "09:00 AM",
      location: "San Francisco Convention Center",
      category: "Technology",
      attendees: 245,
      maxAttendees: 500,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      price: 99,
    },
    {
      id: "2",
      title: "Digital Marketing Masterclass",
      description: "Learn the latest digital marketing strategies and tools from industry experts.",
      date: "2024-02-20",
      time: "02:00 PM",
      location: "Virtual Event",
      category: "Business",
      attendees: 189,
      maxAttendees: 300,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      price: 0,
    },
    {
      id: "3",
      title: "Wellness & Mindfulness Workshop",
      description: "Discover techniques for stress management and mindful living in today's fast-paced world.",
      date: "2024-02-25",
      time: "10:00 AM",
      location: "Zen Center Downtown",
      category: "Health",
      attendees: 67,
      maxAttendees: 100,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      price: 45,
    },
    {
      id: "4",
      title: "Startup Pitch Competition",
      description: "Watch innovative startups present their ideas to top investors and win funding.",
      date: "2024-03-01",
      time: "06:00 PM",
      location: "Innovation Hub NYC",
      category: "Business",
      attendees: 156,
      maxAttendees: 200,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      price: 25,
    },
    {
      id: "5",
      title: "AI & Machine Learning Conference",
      description: "Explore the future of artificial intelligence and machine learning applications.",
      date: "2024-03-05",
      time: "09:30 AM",
      location: "Tech Campus Seattle",
      category: "Technology",
      attendees: 278,
      maxAttendees: 400,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      price: 150,
    },
    {
      id: "6",
      title: "Live Music Festival",
      description: "Three days of amazing live music featuring local and international artists.",
      date: "2024-03-10",
      time: "03:00 PM",
      location: "Central Park Amphitheater",
      category: "Entertainment",
      attendees: 1205,
      maxAttendees: 2000,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      price: 75,
    },
  ];

  const categories = ["all", "Technology", "Business", "Health", "Education", "Entertainment"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  useEffect(() => {
    toast({
      title: "Welcome to your dashboard!",
      description: "Discover amazing events and start networking.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="glass-card rounded-none border-x-0 border-t-0 sticky top-0 z-50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Event Nexus</h1>
                <p className="text-xs text-muted-foreground">User Dashboard</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Button>
              <Button variant="ghost" className="text-foreground">
                <Bookmark className="w-4 h-4 mr-2" />
                My Registrations
              </Button>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="glass-card">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-glass-border/20">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-glass-border/20" />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fadeInUp">
          <div className="glass-card hero-bg relative overflow-hidden">
            <div className="relative z-10 py-16">
              <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                Discover Amazing Events
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with like-minded people and explore events that match your interests
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search events, topics, or locations..."
                  className="pl-12 pr-4 py-4 text-lg glass border-glass-border/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8 animate-slideInRight">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? "primary-glow"
                    : "glass-card border-glass-border/30 hover:border-primary/30"
                } smooth-transition`}
              >
                {category === "all" ? "All Events" : category}
              </Button>
            ))}
          </div>
        </section>

        {/* Events Grid */}
        <section className="animate-fadeInUp">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory === "all" ? "All Events" : `${selectedCategory} Events`}
            </h2>
            <p className="text-muted-foreground">
              {filteredEvents.length} events found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="glass-card max-w-md mx-auto">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No events found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;