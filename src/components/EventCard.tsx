import { useState } from "react";
import { Calendar, MapPin, Users, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  image: string;
  price?: number;
  isRegistered?: boolean;
}

const EventCard = ({
  id,
  title,
  description,
  date,
  time,
  location,
  category,
  attendees,
  maxAttendees,
  image,
  price = 0,
  isRegistered = false,
}: EventCardProps) => {
  const [liked, setLiked] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const [currentAttendees, setCurrentAttendees] = useState(attendees);

  const handleRegister = () => {
    if (registered) {
      setRegistered(false);
      setCurrentAttendees(prev => prev - 1);
      toast({
        title: "Registration Cancelled",
        description: `You have unregistered from ${title}`,
      });
    } else {
      setRegistered(true);
      setCurrentAttendees(prev => prev + 1);
      toast({
        title: "Registration Successful!",
        description: `You are now registered for ${title}`,
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: `${title} ${liked ? "removed from" : "added to"} your favorites`,
    });
  };

  // Calculate countdown
  const eventDateTime = new Date(`${date} ${time}`);
  const now = new Date();
  const timeDiff = eventDateTime.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const getCategoryColor = (category: string) => {
    const colors = {
      "Technology": "bg-primary/20 text-primary border-primary/30",
      "Business": "bg-accent/20 text-accent border-accent/30",
      "Health": "bg-success/20 text-success border-success/30",
      "Education": "bg-warning/20 text-warning border-warning/30",
      "Entertainment": "bg-neon/20 text-neon border-neon/30",
    };
    return colors[category as keyof typeof colors] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  return (
    <div className="glass-card group hover:scale-[1.02] smooth-transition cursor-pointer overflow-hidden">
      {/* Event Image */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 smooth-transition"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(category)} border`}>
            {category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLike}
            className={`glass-card p-2 hover:bg-background/20 ${
              liked ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          </Button>
        </div>
        {daysLeft > 0 && daysLeft <= 7 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-destructive/90 text-destructive-foreground animate-pulse">
              {daysLeft} days left
            </Badge>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:gradient-text smooth-transition">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        </div>

        {/* Event Meta */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{time}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{currentAttendees}/{maxAttendees} attendees</span>
          </div>
        </div>

        {/* Price and Registration */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-border/20">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              {price === 0 ? "Free" : `$${price}`}
            </span>
            {price > 0 && (
              <span className="text-xs text-muted-foreground">per ticket</span>
            )}
          </div>
          <Button
            onClick={handleRegister}
            className={`${
              registered
                ? "bg-success hover:bg-success/80"
                : "primary-glow"
            } smooth-transition`}
            disabled={!registered && currentAttendees >= maxAttendees}
          >
            {registered ? "Registered" : "Register"}
          </Button>
        </div>

        {/* Attendee Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Registration Progress</span>
            <span>{Math.round((currentAttendees / maxAttendees) * 100)}%</span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full smooth-transition"
              style={{ width: `${(currentAttendees / maxAttendees) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;