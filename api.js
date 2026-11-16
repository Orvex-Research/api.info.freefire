/**
 * Free Fire 100% Real Live Player Info API
 * Developed by: SBS
 * Copyright: Copyright by SBS
 * Clean Pretty-Printed JSON
 */

const http = require('http');

function safeParseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) return p;
    } catch (e) {}
  }
  return val ? [val] : [];
}

async function getPlayerInfo(uid) {
  if (!uid) throw new Error('Player UID is required');
  const cleanUid = String(uid).trim();

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://gameskinbo.com/free_fire_id_checker',
    'Origin': 'https://gameskinbo.com',
    'x-api-client': 'gameskinbo-web'
  };

  // Step 1: Request CSRF Token
  const r1 = await fetch('https://gameskinbo.com/api/csrf-token', { headers });
  if (!r1.ok) throw new Error(`CSRF Error: HTTP ${r1.status}`);
  const d1 = await r1.json();
  const csrf = d1?.csrfToken || '';
  const cookie = r1.headers.get('set-cookie') || '';

  // Step 2: Request Session Token
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
  if (!r2.ok) throw new Error(`Session Error: HTTP ${r2.status}`);
  const d2 = await r2.json();
  const token = d2?.token;

  if (!token) throw new Error('Failed to obtain authorization token');

  // Step 3: Fetch Real Player Data
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
    throw new Error(data?.error || `Request failed with HTTP ${r3.status}`);
  }

  const hasGuild = Boolean(data.guild_id && data.guild_id !== 'None' && data.guild_name);
  const guildInfo = hasGuild
    ? {
        has_guild: true,
        id: data.guild_id,
        name: data.guild_name,
        level: data.guild_level,
        capacity: data.guild_capacity,
        member_count: data.guild_member,
        leader_name: data.guild_leader_name,
        leader_uid: data.guild_leader_uid,
        leader_level: data.guild_leader_level,
        leader_likes: data.guild_leader_likes
      }
    : {
        has_guild: false
      };

  const hasPet = Boolean(data.pet_id && data.pet_id !== 0);
  const petInfo = hasPet
    ? {
        has_pet: true,
        id: data.pet_id,
        level: data.pet_level,
        exp: data.pet_exp,
        skill_id: data.pet_selected_skill_id,
        skin_id: data.pet_skin_id
      }
    : {
        has_pet: false
      };

  return {
    success: true,
    developer: 'SBS',
    copyright: 'Copyright by SBS',
    live_server_status: '100% Real Live Data (Garena OB55)',
    player: {
      uid: cleanUid,
      name: data.name,
      level: data.level,
      exp: data.exp,
      likes: Number(data.likes || 0),
      region: data.region || 'BD',
      gender: data.gender || 'Unknown',
      language: data.language || 'Language_EN',
      credit_score: data.credit_score || 100,
      signature: data.signature || 'None',
      created_at: data.created_at,
      last_login: data.last_login,
      br_rank_point: data.br_rank_point || 0,
      br_max_rank: data.br_max_rank || 0,
      cs_rank_point: data.cs_rank_point || 0,
      cs_max_rank: data.cs_max_rank || 0,
      equipped_outfit: safeParseArray(data.equipped_outfit),
      equipped_skills: safeParseArray(data.equipped_skills),
      equipped_weapon: safeParseArray(data.equipped_weapon)
    },
    guild: guildInfo,
    pet: petInfo
  };
}

module.exports = { getPlayerInfo };

if (require.main === module) {
  const arg = process.argv[2];

  if (arg === 'server' || process.env.RUN_SERVER) {
    const PORT = process.env.PORT || 3000;
    const server = http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const uid = reqUrl.searchParams.get('uid');

      if (!uid) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Please provide ?uid=<UID>' }, null, 2));
        return;
      }

      try {
        const result = await getPlayerInfo(uid);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result, null, 2));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, developer: 'SBS', error: err.message }, null, 2));
      }
    });

    server.listen(PORT, () => {
      console.log(`[Server] Free Fire Clean API running on http://localhost:${PORT}`);
    });
  } else {
    const targetUid = arg || '3514787412';
    getPlayerInfo(targetUid)
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        console.error(JSON.stringify({ success: false, developer: 'SBS', error: err.message }, null, 2));
        process.exit(1);
      });
  }
}
