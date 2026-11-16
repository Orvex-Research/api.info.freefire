// Standalone Zero-Dependency Node.js API Server
// Pure JavaScript - Zero HTML
// Run with: node server.js

const http = require('http');
const { getPlayerInfo } = require('./index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // CORS Headers for Mobile Apps & Web Clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;
  const uid = reqUrl.searchParams.get('uid');

  if (pathname === '/api/player' || pathname === '/api/account-info' || pathname === '/') {
    if (!uid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'UID query parameter is required. Example: /api/player?uid=949587293'
      }, null, 2));
      return;
    }

    try {
      const data = await getPlayerInfo(uid);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data, null, 2));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }, null, 2));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found. Use /api/player?uid={UID}' }));
  }
});

server.listen(PORT, () => {
  console.log(`[Pure JS Server] Free Fire Live API running on http://localhost:${PORT}`);
  console.log(`[Endpoint] http://localhost:${PORT}/api/player?uid=949587293`);
});
