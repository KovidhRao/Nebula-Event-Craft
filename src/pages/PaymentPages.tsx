// src/pages/PaymentPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 🟢 Extract regId safely from either URL or state
  const regId =
    searchParams.get("regId") || location.state?.regId || null;

  const [amount, setAmount] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // 🟣 Fetch registration details from Firestore
  useEffect(() => {
    const fetchRegistration = async () => {
      console.log("🧭 regId from URL or state:", regId);
      if (!regId) return;

      try {
        const regRef = doc(db, "registrations", regId);
        const regSnap = await getDoc(regRef);

        if (regSnap.exists()) {
          const regData = regSnap.data();
          console.log("✅ Registration found:", regData);
          setAmount(regData.amount || 0);

          // Fetch event title
          if (regData.eventId) {
            const eventRef = doc(db, "events", regData.eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              setEventTitle(eventSnap.data().title);
            }
          }

          setInitialized(true);
        } else {
          toast({
            title: "Registration not found",
            description: "Invalid registration ID provided.",
            variant: "destructive",
          });
          setInitialized(true);
        }
      } catch (error) {
        console.error("❌ Error fetching registration:", error);
        toast({
          title: "Error",
          description: "Could not load registration details.",
          variant: "destructive",
        });
        setInitialized(true);
      }
    };

    fetchRegistration();
  }, [regId]);

  // 💳 Simulate payment success
const handlePayment = async () => {
  if (!regId) return;
  setLoading(true);

  try {
    // simulate payment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // mark registration as paid
    await updateDoc(doc(db, "registrations", regId), {
      status: "paid",
      paymentDone: true,
      paymentDate: new Date(),
    });

    toast({
      title: "Payment Successful!",
      description: `You have successfully registered for ${eventTitle}`,
    });

    // redirect to your real dashboard route
    navigate("/user"); // change to your actual route name (e.g. /user-dashboard)
  } catch (error) {
    console.error(error);
    toast({
      title: "Payment Failed",
      description: "There was an issue processing your payment.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  // 🕓 While regId missing or still fetching data
  if (!regId || !initialized) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-muted-foreground">
        <Card className="p-6 bg-card shadow-lg border border-border/20">
          <CardContent>
            {regId ? "Loading registration details..." : "No registration specified."}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 💰 Main Payment UI
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-background to-muted">
      <Card className="p-8 w-[420px] shadow-2xl border border-primary/20 bg-card/90 backdrop-blur-lg">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">
            Complete Your Registration
          </h2>
          <p className="text-center text-muted-foreground">
            for <span className="font-medium text-foreground">{eventTitle}</span>
          </p>

          <div className="text-center py-4 bg-muted rounded-lg border border-border/10">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-foreground">
              ${amount ?? 0}
            </p>
          </div>

          <div className="space-y-3">
            <Input placeholder="Card Number (e.g. 4242 4242 4242 4242)" />
            <div className="flex space-x-2">
              <Input placeholder="MM/YY" />
              <Input placeholder="CVC" />
            </div>
            <Input placeholder="Name on Card" />
          </div>

          <Button
            onClick={handlePayment}
            className="w-full transition-all"
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${amount ?? 0}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
