// src/components/MyRegistrations.tsx

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/firebase";
import EventCard from "./EventCard";
import { Bookmark } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "@/hooks/use-toast";

const MyRegistrations = () => {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create a query for user's registrations
        const registrationsQuery = query(
          collection(db, "registrations"),
          where("userId", "==", user.uid)
        );

        // 🔄 Real-time listener to update instantly when registration is added/removed
        const unsubscribeSnapshot = onSnapshot(
          registrationsQuery,
          async (snapshot) => {
            if (snapshot.empty) {
              setRegisteredEvents([]);
              setLoading(false);
              return;
            }

            // Filter registrations that are actually registered or paid
            const validRegs = snapshot.docs
              .map((doc) => doc.data())
              .filter(
                (reg) =>
                  reg.status === "registered" ||
                  reg.status === "paid" ||
                  reg.status === "pending_payment"
              );

            if (validRegs.length === 0) {
              setRegisteredEvents([]);
              setLoading(false);
              return;
            }

            // Fetch event details for all valid registrations
            const eventPromises = validRegs.map(async (reg) => {
              const eventDoc = await getDoc(doc(db, "events", reg.eventId));
              if (eventDoc.exists()) {
                return {
                  id: eventDoc.id,
                  ...eventDoc.data(),
                  registrationStatus: reg.status, // keep reference
                  registrationId: reg.eventId,
                };
              }
              return null;
            });

            const eventResults = await Promise.all(eventPromises);
            const filteredEvents = eventResults.filter((e) => e !== null);

            setRegisteredEvents(filteredEvents);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching registrations:", error);
            toast({
              title: "Error loading registrations",
              description: "Please refresh the page.",
              variant: "destructive",
            });
            setLoading(false);
          }
        );

        // Clean up snapshot listener when user logs out
        return () => unsubscribeSnapshot();
      } else {
        setRegisteredEvents([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="animate-fadeInUp">
      <h2 className="text-3xl font-bold text-foreground mb-6">
        My Registered Events
      </h2>

      {registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glass-card max-w-md mx-auto">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              You haven't registered for any events yet.
            </h3>
            <p className="text-muted-foreground">
              Browse the events to find one that interests you!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyRegistrations;
