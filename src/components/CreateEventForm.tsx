// src/components/CreateEventForm.tsx

import { useState } from "react";
import { collection, addDoc, doc } from "firebase/firestore";
// Assuming correct import path for Firebase services
import { db } from "@/firebase"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Assuming you have defined a toast utility at this path
import { toast } from "@/hooks/use-toast"; 
import { Calendar, Clock, MapPin, Users, DollarSign, Tag, Image as ImageIcon } from "lucide-react";
import { uploadFileToFirebase } from '@/lib/firebaseStorageService'; 

interface EventFormState {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxAttendees: number;
  price: number;
  imageFile: File | null; 
  imageUrl: string; 
}

const defaultImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop";

const CreateEventForm = () => {
  const [eventData, setEventData] = useState<EventFormState>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxAttendees: 100,
    price: 0,
    imageFile: null,
    imageUrl: defaultImage, 
  });
  const [isUploading, setIsUploading] = useState(false);


  const handleInputChange = (field: keyof EventFormState, value: string | number) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEventData((prev) => ({ 
        ...prev, 
        imageFile: file,
        imageUrl: file ? "" : defaultImage // Clear URL while file is pending upload
    }));
  };


  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date || !eventData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    let finalImageUrl = eventData.imageUrl;
    // Generate a unique ID before upload for the storage path and Firestore document
    const newEventRef = doc(collection(db, "events")); 
    
    try {
      // 1. Firebase Storage Upload Logic
      if (eventData.imageFile) {
        toast({ title: "Uploading Image", description: "Please wait...", variant: "default" });
        
        // Upload file and get the public download URL
        finalImageUrl = await uploadFileToFirebase(eventData.imageFile, newEventRef.id);
        
        toast({ title: "Image Uploaded", description: "Thumbnail saved to Firebase Storage.", variant: "success" });
      }

      // 2. Save Event Data to Firestore
      await addDoc(collection(db, "events"), {
        eventId: newEventRef.id, 
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        maxAttendees: eventData.maxAttendees,
        price: eventData.price,
        imageUrl: finalImageUrl, // 👈 Save the public download URL
        attendees: 0, 
      });

      toast({
        title: "Event Created!",
        description: `${eventData.title} has been successfully created.`,
        variant: "success",
      });
      
      // Reset form
      setEventData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        maxAttendees: 100,
        price: 0,
        imageFile: null,
        imageUrl: defaultImage,
      });

    } catch (error: any) {
      console.error("Error creating event: ", error);
      toast({
        title: "Error",
        description: error.message.includes("storage") ? error.message : "Could not create the event.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-card animate-fadeInUp">
      <h2 className="text-2xl font-bold gradient-text mb-6">Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="e.g., Tech Innovation Summit" value={eventData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="glass" disabled={isUploading} />
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="category" placeholder="e.g., Technology" value={eventData.category} onChange={(e) => handleInputChange("category", e.target.value)} className="pl-10 glass" disabled={isUploading} />
            </div>
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="date" type="date" value={eventData.date} onChange={(e) => handleInputChange("date", e.target.value)} className="pl-10 glass" disabled={isUploading} />
            </div>
          </div>
          
          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="time" type="time" value={eventData.time} onChange={(e) => handleInputChange("time", e.target.value)} className="pl-10 glass" disabled={isUploading} />
            </div>
          </div>
          
          {/* Location */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="location" placeholder="e.g., San Francisco Convention Center" value={eventData.location} onChange={(e) => handleInputChange("location", e.target.value)} className="pl-10 glass" disabled={isUploading} />
            </div>
          </div>
          
          {/* Thumbnail/Image Upload Field */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor="imageFile">Event Thumbnail (Firebase Storage)</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="imageFile" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="pl-10 glass file:bg-primary file:text-primary-foreground file:font-semibold" 
                disabled={isUploading}
              />
            </div>
            {eventData.imageFile && 
              <p className="text-xs text-muted-foreground">Selected: {eventData.imageFile.name}</p>
            }
          </div>


          {/* Description */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your event..." value={eventData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="glass" disabled={isUploading} />
          </div>
          
          {/* Max Attendees */}
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Max Attendees</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="maxAttendees" type="number" value={eventData.maxAttendees} onChange={(e) => handleInputChange("maxAttendees", Number(e.target.value))} className="pl-10 glass" disabled={isUploading} />
            </div>
          </div>
          
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="price" type="number" placeholder="0 for free event" value={eventData.price} onChange={(e) => handleInputChange("price", Number(e.target.value))} className="pl-10 glass" disabled={isUploading} />
            </div>
          </div>
          
        </div>
        <Button type="submit" className="w-full primary-glow" disabled={isUploading}>
          {isUploading ? 'Uploading & Creating...' : 'Create Event'}
        </Button>
      </form>
    </div>
  );
};

export default CreateEventForm;