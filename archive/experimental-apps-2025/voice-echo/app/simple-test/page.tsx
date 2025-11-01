export default function SimpleTestPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#1f2937',
            marginBottom: '1rem',
          }}
        >
          🎵 Audio Intel Live
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            marginBottom: '2rem',
          }}
        >
          Server is running successfully! PostCraft design system is active.
        </p>

        <div
          style={{
            background: 'linear-gradient(to right, #1E88E5, #3b82f6)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            display: 'inline-block',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(30, 136, 229, 0.4)',
          }}
        >
          ✅ Everything is working perfectly!
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Next Steps:</h3>
          <ul style={{ color: '#6b7280', margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              Visit the main page at <strong>localhost:3000</strong>
            </li>
            <li>
              Check the test page at <strong>localhost:3000/test</strong>
            </li>
            <li>All PostCraft styling should now be visible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
