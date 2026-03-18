import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { db } from "@/firebase";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const eventId = params.get("eventId");

  useEffect(() => {
    const updateRegistration = async () => {
      if (!eventId) return;
      await updateDoc(doc(db, "registrations", eventId), {
        status: "paid",
        paidAt: serverTimestamp(),
      });
      await addDoc(collection(db, "payments"), {
        eventId,
        status: "success",
        timestamp: serverTimestamp(),
      });
      await addDoc(collection(db, "notifications"), {
        title: "New Payment",
        description: `Registration for event ${eventId} completed.`,
        timestamp: serverTimestamp(),
      });
    };
    updateRegistration();
  }, [eventId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6">
      <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-400 mb-6">Your registration has been confirmed.</p>
      <Button onClick={() => (window.location.href = "/user-dashboard")}>Go to Dashboard</Button>
    </div>
  );
}
