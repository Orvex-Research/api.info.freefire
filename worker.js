// Cloudflare Worker: 100% Real Live Free Fire Player Info API
// Deploy free on workers.cloudflare.com

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const uid = url.searchParams.get("uid");
    if (!uid) {
      return new Response(
        JSON.stringify({ success: false, error: "UID parameter is required. Example: ?uid=949587293" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    try {
      const baseHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://gameskinbo.com/free_fire_id_checker",
        "Origin": "https://gameskinbo.com",
        "x-api-client": "gameskinbo-web"
      };

      // 1. CSRF
      const r1 = await fetch("https://gameskinbo.com/api/csrf-token", { headers: baseHeaders });
      const d1 = await r1.json();
      const csrf = d1?.csrfToken || "";
      const cookie = r1.headers.get("set-cookie") || "";

      // 2. Session
      const r2 = await fetch("https://gameskinbo.com/api/ff_id_checker/session", {
        method: "POST",
        headers: { ...baseHeaders, "Content-Type": "application/json", "x-csrf-token": csrf, "cookie": cookie },
        body: JSON.stringify({ uid: String(uid).trim() })
      });
      const d2 = await r2.json();
      const token = d2?.token;

      if (!token) {
        return new Response(
          JSON.stringify({ success: false, error: "Failed to establish upstream session token" }),
          { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }

      // 3. Fetch Player
      const r3 = await fetch("https://gameskinbo.com/api/ff_id_checker", {
        method: "POST",
        headers: { ...baseHeaders, "Content-Type": "application/json", "x-csrf-token": csrf, "x-ff-id-checker-token": token, "cookie": cookie },
        body: JSON.stringify({ uid: String(uid).trim() })
      });
      const data = await r3.json();

      return new Response(JSON.stringify({ success: true, ...data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
