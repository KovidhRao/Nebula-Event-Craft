// src/components/ManageEvents.tsx

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EditEventForm from "./EditEventForm"; // Import the new form

const ManageEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsData);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      await deleteDoc(doc(db, "events", eventId));
      toast({ title: "Event Deleted" });
      fetchEvents();
    }
  };

  if (editingEvent) {
    return <EditEventForm event={editingEvent} onFinished={() => {
      setEditingEvent(null);
      fetchEvents();
    }} />;
  }

  return (
    <div className="glass-card animate-fadeInUp">
      <h2 className="text-2xl font-bold gradient-text mb-6">Manage Events</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-glass-border/20">
            <TableHead>Event Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} className="border-glass-border/20">
              <TableCell className="font-medium text-foreground">{event.title}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingEvent(event)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(event.id, event.title)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageEvents;