const http = require('http');
const url = require('url');

console.log('🌐 Starting OAuth callback server on http://localhost:3001');
console.log('Ready to receive Gmail authorization...');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/callback' && parsedUrl.query.code) {
    console.log('✅ Authorization code received!');
    console.log('📋 Your authorization code is:');
    console.log(parsedUrl.query.code);
    console.log('');
    console.log('🚀 Now run:');
    console.log(`export GOOGLE_CLIENT_SECRET="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" && node radio-promo-agent.js save-gmail-token ${parsedUrl.query.code}`);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Gmail Authorization Complete</title></head>
        <body>
          <h1>✅ Authorization Successful!</h1>
          <p>Your authorization code is: <code>${parsedUrl.query.code}</code></p>
          <p>You can close this window and return to your terminal.</p>
        </body>
      </html>
    `);

    setTimeout(() => {
      server.close();
      console.log('🛑 OAuth server stopped');
    }, 5000);
  } else if (parsedUrl.query.error) {
    console.log('❌ Authorization error:', parsedUrl.query.error);
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Gmail Authorization Error</title></head>
        <body>
          <h1>❌ Authorization Error</h1>
          <p>Error: ${parsedUrl.query.error}</p>
          <p>Please check your Google Console configuration.</p>
        </body>
      </html>
    `);
    server.close();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Gmail OAuth Server</title></head>
        <body>
          <h1>🔐 Gmail OAuth Server</h1>
          <p>Waiting for authorization callback...</p>
        </body>
      </html>
    `);
  }
});

server.listen(3001, () => {
  console.log('Server ready! Now click the Gmail authorization URL.');
});