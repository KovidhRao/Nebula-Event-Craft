import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🔹 Listen to Maintenance Mode changes in real-time
    const unsub = onSnapshot(doc(db, "settings", "site"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as any;
        setMaintenance(!!data.maintenanceMode);
      } else {
        setMaintenance(false);
      }
    });

    // 🔹 Check if the logged-in user is an admin
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdTokenResult();
          // Assuming you use custom claims or role field for admin
          if (token.claims.admin || user.email?.includes("admin")) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      unsub();
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    // 🔹 If maintenance mode is on and user is not admin, redirect
    if (maintenance && !isAdmin && location.pathname !== "/maintenance") {
      navigate("/maintenance");
    }
    // 🔹 If maintenance is off and user is stuck on maintenance page, bring back home
    else if (!maintenance && location.pathname === "/maintenance") {
      navigate("/");
    }
  }, [maintenance, isAdmin, loading, navigate, location.pathname]);

  return <>{children}</>;
}
