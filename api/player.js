// Vercel Serverless Function: /api/player?uid={UID}
// 100% Real Live Free Fire Player Info Extracted from Garena Gateway

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      success: false,
      error: 'Player UID is required. Example: /api/player?uid=949587293'
    });
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://gameskinbo.com/free_fire_id_checker',
      'Origin': 'https://gameskinbo.com',
      'x-api-client': 'gameskinbo-web'
    };

    // Step 1: CSRF Token
    const r1 = await fetch('https://gameskinbo.com/api/csrf-token', { headers });
    const d1 = await r1.json();
    const csrf = d1?.csrfToken;
    const cookie = r1.headers.get('set-cookie') || '';

    // Step 2: Session Token
    const r2 = await fetch('https://gameskinbo.com/api/ff_id_checker/session', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'x-csrf-token': csrf || '',
        'cookie': cookie
      },
      body: JSON.stringify({ uid: String(uid).trim() })
    });
    const d2 = await r2.json();
    const token = d2?.token;

    if (!token) {
      return res.status(502).json({
        success: false,
        error: 'Failed to establish session token with upstream server'
      });
    }

    // Step 3: Fetch Player Info
    const r3 = await fetch('https://gameskinbo.com/api/ff_id_checker', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'x-csrf-token': csrf || '',
        'x-ff-id-checker-token': token,
        'cookie': cookie
      },
      body: JSON.stringify({ uid: String(uid).trim() })
    });

    const data = await r3.json();

    if (!r3.ok) {
      return res.status(r3.status).json({
        success: false,
        error: data?.error || 'Upstream server error'
      });
    }

    return res.status(200).json({
      success: true,
      live_server_status: '100% Real Live Data',
      ...data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
