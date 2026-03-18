// src/components/EditEventForm.tsx

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface EditEventFormProps {
  event: any;
  onFinished: () => void; // Function to close the form
}

const EditEventForm = ({ event, onFinished }: EditEventFormProps) => {
  const [eventData, setEventData] = useState(event);

  useEffect(() => {
    setEventData(event);
  }, [event]);

  const handleInputChange = (field: string, value: string | number) => {
    setEventData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventRef = doc(db, "events", event.id);
    try {
      await updateDoc(eventRef, eventData);
      toast({
        title: "Event Updated!",
        description: `${eventData.title} has been successfully updated.`,
      });
      onFinished(); // Close the form and refresh the list
    } catch (error) {
      console.error("Error updating event: ", error);
      toast({ title: "Error", description: "Could not update the event.", variant: "destructive" });
    }
  };

  return (
    <div className="glass-card animate-fadeInUp p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6">Edit Event</h2>
      <form onSubmit={handleUpdateEvent} className="space-y-4">
        {/* Form fields pre-filled with event data */}
        <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" value={eventData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="glass"/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={eventData.date} onChange={(e) => handleInputChange("date", e.target.value)} className="glass"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={eventData.location} onChange={(e) => handleInputChange("location", e.target.value)} className="glass"/>
        </div>
        <Textarea value={eventData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="glass"/>
        <div className="flex gap-4">
          <Button type="submit" className="w-full primary-glow">Save Changes</Button>
          <Button type="button" variant="outline" className="w-full" onClick={onFinished}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EditEventForm;