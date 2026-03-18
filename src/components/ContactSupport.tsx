// src/components/ContactSupport.tsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const ContactSupport = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const user = auth.currentUser;

  // Optional: Find open existing ticket for same user+subject (commented out; you can enable)
  // const findExistingTicket = async () => {
  //   const q = query(collection(db, "supportMessages"), where("userId", "==", user.uid), where("status", "==", "open"), orderBy("timestamp", "desc"), limit(1));
  //   const snap = await getDocs(q);
  //   return snap.docs.length ? snap.docs[0] : null;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login", description: "You must be logged in to contact support", variant: "destructive" });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Missing fields", description: "Please provide a subject and message", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      // Create a new supportMessages document
      const docRef = await addDoc(collection(db, "supportMessages"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || "",
        subject: subject.trim(),
        status: "open",
        timestamp: serverTimestamp(),   // top-level server time
        lastRepliedAt: serverTimestamp(),
        messages: [
          {
            sender: "user",
            text: message.trim(),
            timestamp: new Date().toISOString(), // client-side ISO string
          },
        ],
      });

      toast({ title: "Message sent", description: "We will get back to you soon." });
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("ContactSupport error:", error);
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>Report an issue or ask a question</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue..." />
          </div>
          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactSupport;
