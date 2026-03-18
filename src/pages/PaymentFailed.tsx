import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6">
      <XCircle className="w-20 h-20 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Failed!</h1>
      <p className="text-gray-400 mb-6">Something went wrong. Please try again later.</p>
      <Button onClick={() => (window.location.href = "/events")}>Try Again</Button>
    </div>
  );
}
