// src/components/AnalyticsDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

/**
 * Creates a label for month-year (e.g., "Sep '25")
 */
const fmtMonth = (d: Date) => format(d, "MMM yy");

const AnalyticsDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubE = onSnapshot(collection(db, "events"), (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubR = onSnapshot(collection(db, "registrations"), (snap) => {
      setRegistrations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => {
      unsubE();
      unsubR();
    };
  }, []);

  // Compute monthly revenue series for last 12 months
  const revenueSeries = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }).map((_, i) => {
      const dt = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { label: fmtMonth(dt), key: `${dt.getFullYear()}-${dt.getMonth()}`, revenue: 0, registrations: 0 };
    });

    // Build a map of events by id for price lookup
    const eventMap = new Map(events.map((e) => [e.id, e]));

    registrations.forEach((r) => {
      const createdAt = r.registrationDate && r.registrationDate.toDate ? r.registrationDate.toDate() : r.registrationDate ? new Date(r.registrationDate) : new Date();
      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const month = months.find((m) => m.key === key);
      if (month) {
        const ev = eventMap.get(r.eventId);
        const price = ev ? Number(ev.price || 0) : 0;
        month.revenue += price;
        month.registrations += 1;
      }
    });

    return months;
  }, [events, registrations]);

  // Top 5 popular events (by registrations)
  const topEvents = useMemo(() => {
    const count: Record<string, number> = {};
    registrations.forEach((r) => {
      count[r.eventId] = (count[r.eventId] || 0) + 1;
    });
    const arr = Object.entries(count)
      .map(([eventId, cnt]) => {
        const e = events.find((ev) => ev.id === eventId);
        return { id: eventId, title: e?.title || "Unknown Event", count: cnt };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    return arr;
  }, [events, registrations]);

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/40">
          <CardHeader>
            <CardTitle>Monthly Revenue (Last 12 months)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/40">
          <CardHeader>
            <CardTitle>Top Events (by registrations)</CardTitle>
          </CardHeader>
          <CardContent>
            {topEvents.length === 0 ? (
              <div className="text-muted-foreground">No registrations yet.</div>
            ) : (
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border">
        <CardHeader>
          <CardTitle>Realtime Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div>
              <div className="text-sm text-muted-foreground">Total Events</div>
              <div className="text-2xl font-bold">{events.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Registrations</div>
              <div className="text-2xl font-bold">{registrations.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Unique Attendees</div>
              <div className="text-2xl font-bold">{new Set(registrations.map((r) => r.userId)).size}</div>
            </div>
            <div className="ml-auto">
              <Badge className="bg-primary/20 text-primary">Last update: live</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
