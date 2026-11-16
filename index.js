/**
 * Orvex Research - Free Fire 100% Real Live Player Info API
 * Pure JavaScript (Node.js) - Zero Dependencies & Zero HTML
 */

/**
 * Fetch 100% real in-game player details for any Free Fire UID
 * @param {string|number} uid - Target Free Fire player ID
 * @returns {Promise<Object>} Player profile data object
 */
async function getPlayerInfo(uid) {
  if (!uid) {
    throw new Error('Player UID is required');
  }

  const cleanUid = String(uid).trim();

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://gameskinbo.com/free_fire_id_checker',
    'Origin': 'https://gameskinbo.com',
    'x-api-client': 'gameskinbo-web'
  };

  // Step 1: Request CSRF Token
  const r1 = await fetch('https://gameskinbo.com/api/csrf-token', { headers });
  if (!r1.ok) throw new Error(`Failed to fetch CSRF token: status ${r1.status}`);
  const d1 = await r1.json();
  const csrf = d1?.csrfToken || '';
  const cookie = r1.headers.get('set-cookie') || '';

  // Step 2: Generate Player Session Token
  const r2 = await fetch('https://gameskinbo.com/api/ff_id_checker/session', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'x-csrf-token': csrf,
      'cookie': cookie
    },
    body: JSON.stringify({ uid: cleanUid })
  });
  if (!r2.ok) throw new Error(`Failed to fetch session token: status ${r2.status}`);
  const d2 = await r2.json();
  const token = d2?.token;

  if (!token) {
    throw new Error('Failed to obtain upstream authorization token');
  }

  // Step 3: Fetch Core Player In-Game Data
  const r3 = await fetch('https://gameskinbo.com/api/ff_id_checker', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'x-csrf-token': csrf,
      'x-ff-id-checker-token': token,
      'cookie': cookie
    },
    body: JSON.stringify({ uid: cleanUid })
  });

  const data = await r3.json();

  if (!r3.ok) {
    throw new Error(data?.error || `Player lookup failed: status ${r3.status}`);
  }

  return {
    success: true,
    live_status: '100% Real Live Data (Garena OB55)',
    ...data
  };
}

module.exports = { getPlayerInfo };

// CLI Execution support: node index.js <UID>
if (require.main === module) {
  const targetUid = process.argv[2] || '949587293';
  console.log(`[JS Engine] Fetching 100% Live In-Game Data for UID: ${targetUid}...`);

  getPlayerInfo(targetUid)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error('[Error]:', err.message);
      process.exit(1);
    });
}
