import { useState } from 'react';

export default function ClaudeChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    const res = await fetch('http://localhost:3001/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setResponse(data?.content || JSON.stringify(data));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={4}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask Claude anything..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSend}
      >
        Send to Claude
      </button>
      <div className="mt-4">
        <strong>Claude says:</strong>
        <pre className="bg-gray-100 p-2 rounded">{response}</pre>
      </div>
    </div>
  );
}
