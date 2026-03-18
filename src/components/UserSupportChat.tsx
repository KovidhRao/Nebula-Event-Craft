// src/components/UserSupportChat.tsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const UserSupportChat = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const user = auth.currentUser;

  // 🔹 Listen to user's tickets in real-time
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "supportMessages"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(data);
    });

    return () => unsub();
  }, [user]);

  // 🔹 Send user reply
  const handleSendMessage = async () => {
    if (!selectedTicket || !message.trim()) {
      toast({ title: "Error", description: "Please type your message.", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const ref = doc(db, "supportMessages", selectedTicket.id);
      await updateDoc(ref, {
        messages: arrayUnion({
          sender: "user",
          text: message.trim(),
          timestamp: new Date().toISOString(),
        }),
        lastRepliedAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  // 🔹 Ticket viewer (chat view)
  if (selectedTicket) {
    const messages = selectedTicket.messages || [];

    return (
      <Card className="bg-card border shadow-sm">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{selectedTicket.subject}</span>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Back
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="max-h-[400px] overflow-y-auto space-y-4 p-2">
            {messages.map((m: any, idx: number) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(m.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 🔹 Ticket list view
  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader>
        <CardTitle>My Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground text-center">No support messages yet.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="p-3 rounded-md cursor-pointer hover:bg-muted/30 transition"
              >
                <h3 className="font-medium text-foreground">{t.subject}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {t.messages?.slice(-1)[0]?.text || "No messages"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated:{" "}
                  {t.lastRepliedAt?.toDate
                    ? new Date(t.lastRepliedAt.toDate()).toLocaleString()
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSupportChat;
