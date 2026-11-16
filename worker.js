/**
 * Cloudflare Worker: Free Fire 100% Real Live Player Info API
 * Developed by: SBS
 * Copyright: Copyright by SBS
 * Output: Clean Pretty-Printed JSON (Zero Duplicate Data)
 */

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

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const uid = url.searchParams.get('uid');

    if (!uid) {
      return new Response(
        JSON.stringify(
          {
            status: 'Online',
            developer: 'SBS',
            copyright: 'Copyright by SBS',
            service: 'Free Fire 100% Live Player Info API',
            usage: 'Add ?uid=<PLAYER_UID> to the URL',
            examples: [
              `${url.origin}/?uid=949587293`,
              `${url.origin}/?uid=3514787412`
            ]
          },
          null,
          2
        ),
        { status: 200, headers: corsHeaders }
      );
    }

    try {
      const cleanUid = String(uid).trim();

      const baseHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://gameskinbo.com/free_fire_id_checker',
        'Origin': 'https://gameskinbo.com',
        'x-api-client': 'gameskinbo-web'
      };

      // Step 1: Request CSRF Token
      const r1 = await fetch('https://gameskinbo.com/api/csrf-token', { headers: baseHeaders });
      if (!r1.ok) throw new Error(`Upstream CSRF HTTP ${r1.status}`);
      const d1 = await r1.json();
      const csrf = d1?.csrfToken || '';
      const cookie = r1.headers.get('set-cookie') || '';

      // Step 2: Request Session Token
      const r2 = await fetch('https://gameskinbo.com/api/ff_id_checker/session', {
        method: 'POST',
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
          'cookie': cookie
        },
        body: JSON.stringify({ uid: cleanUid })
      });
      if (!r2.ok) throw new Error(`Upstream Session HTTP ${r2.status}`);
      const d2 = await r2.json();
      const token = d2?.token;

      if (!token) throw new Error('Failed to obtain upstream session token');

      // Step 3: Fetch Real Player In-Game Data
      const r3 = await fetch('https://gameskinbo.com/api/ff_id_checker', {
        method: 'POST',
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
          'x-ff-id-checker-token': token,
          'cookie': cookie
        },
        body: JSON.stringify({ uid: cleanUid })
      });

      const data = await r3.json();

      if (!r3.ok) {
        return new Response(
          JSON.stringify({ success: false, developer: 'SBS', error: data?.error || 'Player lookup failed' }, null, 2),
          { status: r3.status, headers: corsHeaders }
        );
      }

      // Check guild status
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

      // Check pet status
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

      // Clean Response Object with Copyright by SBS
      const cleanResponse = {
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

      return new Response(JSON.stringify(cleanResponse, null, 2), {
        status: 200,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, developer: 'SBS', error: err.message }, null, 2),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
