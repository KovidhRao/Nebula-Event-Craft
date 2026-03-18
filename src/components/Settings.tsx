// src/components/Settings.tsx
import React, { useEffect, useState, useCallback } from "react";
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type SiteSettings = {
  siteName?: string;
  maintenanceMode?: boolean;
  allowRegistrations?: boolean;
  notificationsEnabled?: boolean;
  updatedAt?: any;
};

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Local editable state
  const [siteName, setSiteName] = useState<string>("Event Nexus");
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [allowRegistrations, setAllowRegistrations] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  // Keep a snapshot of the last values from Firestore to support Reset
  const [remoteSnapshot, setRemoteSnapshot] = useState<SiteSettings | null>(null);

  const settingsDocRef = doc(db, "settings", "site");

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;

          // Update UI only when values are present (preserve defaults otherwise)
          if (typeof data.siteName === "string") setSiteName(data.siteName);
          if (typeof data.maintenanceMode === "boolean")
            setMaintenanceMode(data.maintenanceMode);
          if (typeof data.allowRegistrations === "boolean")
            setAllowRegistrations(data.allowRegistrations);
          if (typeof data.notificationsEnabled === "boolean")
            setNotificationsEnabled(data.notificationsEnabled);

          setRemoteSnapshot(data);

          if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
            setLastSynced(data.updatedAt.toDate());
          } else {
            setLastSynced(new Date());
          }
        } else {
          // No doc yet: keep defaults and set remoteSnapshot to null
          setRemoteSnapshot(null);
          setLastSynced(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Settings snapshot error:", err);
        toast({
          title: "Error",
          description: "Could not load settings (check console).",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []); // settingsDocRef stable because db is stable

  const saveSettings = useCallback(async () => {
    setSaving(true);
    try {
      await setDoc(
        settingsDocRef,
        {
          siteName,
          maintenanceMode,
          allowRegistrations,
          notificationsEnabled,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: "Saved",
        description: "Site settings saved successfully.",
      });
    } catch (err) {
      console.error("Save settings error:", err);
      toast({
        title: "Save failed",
        description: "Could not save settings. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [siteName, maintenanceMode, allowRegistrations, notificationsEnabled]);

  const resetToRemote = useCallback(() => {
    if (!remoteSnapshot) {
      toast({
        title: "Nothing to reset",
        description: "No remote settings found to reset to.",
      });
      return;
    }

    if (typeof remoteSnapshot.siteName === "string") setSiteName(remoteSnapshot.siteName);
    if (typeof remoteSnapshot.maintenanceMode === "boolean")
      setMaintenanceMode(remoteSnapshot.maintenanceMode);
    if (typeof remoteSnapshot.allowRegistrations === "boolean")
      setAllowRegistrations(remoteSnapshot.allowRegistrations);
    if (typeof remoteSnapshot.notificationsEnabled === "boolean")
      setNotificationsEnabled(remoteSnapshot.notificationsEnabled);

    toast({
      title: "Reset",
      description: "Settings reverted to last saved values.",
    });
  }, [remoteSnapshot]);

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6 bg-card/60 border-glass-border/20">
        <CardHeader>
          <CardTitle className="text-2xl">Application Settings</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-muted-foreground">Site Name</label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Site name"
                disabled={loading}
              />

              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-sm font-medium">Maintenance Mode</div>
                  <div className="text-xs text-muted-foreground">Place site into maintenance to block user access</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="toggle-checkbox mr-2"
                    />
                    <span className="text-sm">{maintenanceMode ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Allow New Registrations</div>
                  <div className="text-xs text-muted-foreground">Toggle to allow or disable new registrations</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={allowRegistrations}
                      onChange={(e) => setAllowRegistrations(e.target.checked)}
                      className="toggle-checkbox mr-2"
                    />
                    <span className="text-sm">{allowRegistrations ? "Allowed" : "Blocked"}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Notifications Enabled</div>
                  <div className="text-xs text-muted-foreground">Control site-wide notifications</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="toggle-checkbox mr-2"
                    />
                    <span className="text-sm">{notificationsEnabled ? "On" : "Off"}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center gap-3">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            <Button variant="outline" onClick={resetToRemote} disabled={loading || !remoteSnapshot}>
              Reset
            </Button>

            <div className="ml-auto text-sm text-muted-foreground">
              {lastSynced ? (
                <div>Last saved: {lastSynced.toLocaleString()}</div>
              ) : (
                <div>Not saved yet</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* tiny styles for checkbox toggles (simple) */}
      <style jsx>{`
        .toggle-checkbox {
          width: 44px;
          height: 24px;
          -webkit-appearance: none;
          appearance: none;
          background: #222;
          border-radius: 999px;
          position: relative;
          outline: none;
          cursor: pointer;
          transition: background 150ms;
        }
        .toggle-checkbox:checked {
          background: linear-gradient(90deg, #7c3aed, #4f46e5);
        }
        .toggle-checkbox::after {
          content: "";
          position: absolute;
          left: 3px;
          top: 3px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: white;
          transition: transform 150ms;
        }
        .toggle-checkbox:checked::after {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
}
