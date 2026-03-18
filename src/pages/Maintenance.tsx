// src/pages/Maintenance.tsx
import { AlertTriangle } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold mb-2">We'll be back soon!</h1>
      <p className="text-gray-400 text-center max-w-md">
        The site is currently under maintenance. Please check back later.  
        Thank you for your patience.
      </p>
    </div>
  );
}
