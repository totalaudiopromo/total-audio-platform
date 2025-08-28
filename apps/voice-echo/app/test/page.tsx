export default function TestPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '32px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1f2937', marginBottom: '32px' }}>
        Audio Intel Test Page
      </h1>
      
      <div className="postcraft-container" style={{ padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>PostCraft Container Test</h2>
        <p style={{ color: '#374151' }}>This should have white background with rounded corners and shadow.</p>
      </div>

      <div className="postcraft-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>PostCraft Card Test</h2>
        <p style={{ color: '#374151' }}>This should have white background with rounded corners, shadow, and hover effects.</p>
      </div>

      <div style={{ 
        background: 'linear-gradient(to right, #1E88E5, #3b82f6)', 
        color: 'white', 
        padding: '24px', 
        borderRadius: '20px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Color Test</h2>
        <p>This should have blue gradient background.</p>
      </div>

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Diagnostic Info:</h3>
        <p>✅ Server is running</p>
        <p>✅ React components are rendering</p>
        <p>✅ Basic styling (inline) works</p>
        <p>🔍 Testing PostCraft CSS classes above</p>
      </div>
    </div>
  )
} 