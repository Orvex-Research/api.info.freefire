// Standalone Zero-Dependency Node.js Server
// Run with: node server.js

const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

async function getPlayerInfo(uid) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
    'Referer': 'https://gameskinbo.com/free_fire_id_checker',
    'Origin': 'https://gameskinbo.com',
    'x-api-client': 'gameskinbo-web'
  };

  // 1. CSRF
  const r1 = await fetch('https://gameskinbo.com/api/csrf-token', { headers });
  const d1 = await r1.json();
  const csrf = d1?.csrfToken || '';
  const cookie = r1.headers.get('set-cookie') || '';

  // 2. Session
  const r2 = await fetch('https://gameskinbo.com/api/ff_id_checker/session', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', 'x-csrf-token': csrf, 'cookie': cookie },
    body: JSON.stringify({ uid: String(uid).trim() })
  });
  const d2 = await r2.json();
  const token = d2?.token;

  if (!token) throw new Error('Failed to get session token from upstream');

  // 3. Player Data
  const r3 = await fetch('https://gameskinbo.com/api/ff_id_checker', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', 'x-csrf-token': csrf, 'x-ff-id-checker-token': token, 'cookie': cookie },
    body: JSON.stringify({ uid: String(uid).trim() })
  });

  return await r3.json();
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
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

  if (pathname === '/api/player' || pathname === '/api/account-info') {
    if (!uid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'UID is required. Example: /api/player?uid=949587293' }));
      return;
    }

    try {
      const data = await getPlayerInfo(uid);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, live_server_status: '100% Real Live Data', ...data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'Free Fire 100% Real Live API Server is Running',
      endpoints: [
        '/api/player?uid={UID}',
        '/api/account-info?uid={UID}'
      ]
    }));
  }
});

server.listen(PORT, () => {
  console.log(`Free Fire Node.js Live API Server running on http://localhost:${PORT}`);
});
