/**
 * Cloudflare Worker: Free Fire 100% Real Live Player Info API
 * Orvex Research
 * Output: Pretty-Printed JSON
 * Ready for 1-Click Copy-Paste on workers.cloudflare.com
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const uid = url.searchParams.get('uid');

    // If no UID is provided, return API instructions
    if (!uid) {
      return new Response(
        JSON.stringify(
          {
            status: 'Online',
            service: 'Orvex Research - Free Fire Live Player API',
            usage: 'Add ?uid=<PLAYER_UID> to the URL',
            examples: [
              `${url.origin}/?uid=949587293`,
              `${url.origin}/?uid=2651407194`
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

      // Step 3: Fetch Player In-Game Profile
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
          JSON.stringify({ success: false, error: data?.error || 'Player lookup failed' }, null, 2),
          { status: r3.status, headers: corsHeaders }
        );
      }

      // Parse inner raw_data if stringified
      let parsedRawData = data.raw_data;
      if (typeof data.raw_data === 'string') {
        try {
          parsedRawData = JSON.parse(data.raw_data);
        } catch (e) {}
      }

      // Formulate Pretty-Printed Response
      const responsePayload = {
        success: true,
        live_server_status: '100% Real Live Data (Garena OB55)',
        player: {
          uid: cleanUid,
          name: data.name,
          level: data.level,
          exp: data.exp,
          likes: data.likes,
          region: data.region,
          credit_score: data.credit_score,
          signature: data.signature,
          created_at: data.created_at,
          last_login: data.last_login,
          br_rank_point: data.br_rank_point,
          br_max_rank: data.br_max_rank,
          cs_rank_point: data.cs_rank_point,
          cs_max_rank: data.cs_max_rank,
          equipped_outfit: data.equipped_outfit,
          equipped_skills: data.equipped_skills,
          equipped_weapon: data.equipped_weapon
        },
        guild: {
          id: data.guild_id,
          name: data.guild_name,
          level: data.guild_level,
          capacity: data.guild_capacity,
          member_count: data.guild_member,
          leader_name: data.guild_leader_name,
          leader_uid: data.guild_leader_uid,
          leader_level: data.guild_leader_level,
          leader_likes: data.guild_leader_likes
        },
        pet: {
          id: data.pet_id,
          level: data.pet_level,
          exp: data.pet_exp,
          skill_id: data.pet_selected_skill_id,
          skin_id: data.pet_skin_id
        },
        raw_garena_data: parsedRawData
      };

      return new Response(JSON.stringify(responsePayload, null, 2), {
        status: 200,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err.message }, null, 2),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
