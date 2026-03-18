// src/components/Messages.tsx
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Messages = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // Listen to all support tickets, sorted by timestamp desc
  useEffect(() => {
    const q = query(collection(db, "supportMessages"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTickets(list);
    });
    return () => unsub();
  }, []);

  const handleSendReply = async () => {
    if (!selectedTicket) return;
    if (!reply.trim()) {
      toast({ title: "Empty reply", description: "Type a reply first.", variant: "destructive" });
      return;
    }

    setSending(true);
    const ticketRef = doc(db, "supportMessages", selectedTicket.id);

    try {
      // 1) Append reply to messages array (client timestamp inside arrayUnion is OK)
      await updateDoc(ticketRef, {
        messages: arrayUnion({
          sender: "admin",
          text: reply.trim(),
          timestamp: new Date().toISOString(),
        }),
        // 2) Set server timestamp as a top-level field
        lastRepliedAt: serverTimestamp(),
      });

      setReply("");
      toast({ title: "Reply sent" });
    } catch (error) {
      console.error("Reply send error:", error);
      toast({ title: "Error", description: "Could not send reply.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  // Render selected ticket conversation
  if (selectedTicket) {
    const chat = selectedTicket.messages || [];

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tickets
        </Button>

        <Card className="bg-card border shadow-sm">
          <CardHeader>
            <CardTitle>{selectedTicket.subject}</CardTitle>
            <CardDescription>From: {selectedTicket.userName} ({selectedTicket.userEmail})</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
              {chat.length === 0 && <p className="text-muted-foreground text-center">No messages yet.</p>}

              {chat.map((m: any, idx: number) => (
                <div key={idx} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] ${m.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <p>{m.text}</p>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(m.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input placeholder="Type your reply..." value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendReply()} />
              <Button onClick={handleSendReply} disabled={sending}>{sending ? "Sending..." : "Send Reply"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view of tickets
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Support Tickets</h2>

      {tickets.length === 0 ? (
        <Card className="p-6 text-center">No tickets yet.</Card>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <Card key={t.id} className="p-4 cursor-pointer hover:bg-muted/20" onClick={() => setSelectedTicket(t)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-foreground">{t.subject}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{t.messages?.[0]?.text || "No message"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.userEmail} • {t.timestamp?.toDate ? new Date(t.timestamp.toDate()).toLocaleString() : "—"}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t.status || "open"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
