export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Audio Intel!</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg mb-4">You're successfully signed in.</p>
          <p className="text-gray-600">
            This is your dashboard. Your authentication is working!
          </p>
        </div>
      </div>
    </div>
  )
}
