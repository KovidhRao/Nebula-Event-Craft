import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Settings,
  BarChart3,
  MessageSquare,
  LogOut,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Sparkles,
  Edit,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [notifications, setNotifications] = useState(5);

  // Mock data
  const stats = {
    totalUsers: 1247,
    totalEvents: 23,
    totalRegistrations: 3456,
    revenue: 45670,
  };

  const recentEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "2024-02-15",
      status: "Active",
      registrations: 245,
      maxCapacity: 500,
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      date: "2024-02-20",
      status: "Active",
      registrations: 189,
      maxCapacity: 300,
    },
    {
      id: 3,
      title: "AI Conference",
      date: "2024-03-05",
      status: "Draft",
      registrations: 0,
      maxCapacity: 400,
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Manage Events", icon: Calendar },
    { id: "create", label: "Create Event", icon: Plus },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of admin panel.",
    });
    navigate("/");
  };

  const handleEventAction = (action: string, eventId: number) => {
    toast({
      title: `Event ${action}`,
      description: `Event ${eventId} has been ${action.toLowerCase()}.`,
    });
  };

  useEffect(() => {
    toast({
      title: "Welcome to Admin Panel!",
      description: "Manage your events and view analytics here.",
    });
  }, []);

  const renderDashboard = () => (
    <div className="space-y-8 animate-fadeInUp">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-glass-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +3 this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{stats.totalRegistrations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card className="glass-card border-glass-border/20">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Events</CardTitle>
          <CardDescription>Manage your latest events and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-glass-border/20">
                <TableHead>Event Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id} className="border-glass-border/20">
                  <TableCell className="font-medium text-foreground">
                    {event.title}
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        event.status === "Active" 
                          ? "bg-success/20 text-success border-success/30" 
                          : "bg-warning/20 text-warning border-warning/30"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.registrations}/{event.maxCapacity}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEventAction("Viewed", event.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEventAction("Edited", event.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEventAction("Deleted", event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return renderDashboard();
      case "events":
        return (
          <div className="glass-card animate-fadeInUp">
            <h2 className="text-2xl font-bold gradient-text mb-6">Manage Events</h2>
            <p className="text-muted-foreground">Event management interface coming soon...</p>
          </div>
        );
      case "create":
        return (
          <div className="glass-card animate-fadeInUp">
            <h2 className="text-2xl font-bold gradient-text mb-6">Create New Event</h2>
            <p className="text-muted-foreground">Event creation form coming soon...</p>
          </div>
        );
      case "analytics":
        return (
          <div className="glass-card animate-fadeInUp">
            <h2 className="text-2xl font-bold gradient-text mb-6">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Analytics charts and reports coming soon...</p>
          </div>
        );
      case "messages":
        return (
          <div className="glass-card animate-fadeInUp">
            <h2 className="text-2xl font-bold gradient-text mb-6">Messages</h2>
            <p className="text-muted-foreground">Message center coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="glass-card animate-fadeInUp">
            <h2 className="text-2xl font-bold gradient-text mb-6">Settings</h2>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass-card rounded-none border-y-0 border-l-0 border-r border-glass-border/20">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Event Nexus</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={selectedTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  selectedTab === item.id 
                    ? "primary-glow" 
                    : "hover:bg-glass/50"
                } smooth-transition`}
                onClick={() => setSelectedTab(item.id)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start glass-card">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent mr-3 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-sm">Admin User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-glass-border/20">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {sidebarItems.find(item => item.id === selectedTab)?.label || "Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your events.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button className="primary-glow">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </header>

        {/* Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;