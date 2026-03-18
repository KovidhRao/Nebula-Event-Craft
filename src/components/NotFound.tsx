export default function UserDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-4xl font-bold mb-4 text-purple-500">User Dashboard</h1>
      <p className="text-gray-400 mb-6">Welcome! Your payment was successful.</p>
      <a
        href="/"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all"
      >
        Go Back Home
      </a>
    </div>
  );
}
