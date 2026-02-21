const CORS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
};

function json(statusCode, obj) {
  return new Response(JSON.stringify(obj), { status: statusCode, headers: CORS });
}

function clientIdMissing() {
  const v = process.env.SOUNDCLOUD_CLIENT_ID;
  return !v || v.trim() === "" || v === "YOUR_CLIENT_ID";
}

export default async (req, context) => {
  try {
    if (req.method === "OPTIONS") return new Response("", { status: 204, headers: CORS });
    if (clientIdMissing()) {
      return json(400, { error: "Missing SOUNDCLOUD_CLIENT_ID. Set it in your shell or Netlify env vars (see .env.example)." });
    }

    const clientId = process.env.SOUNDCLOUD_CLIENT_ID;

    const url = new URL(req.url);
    const target = (url.searchParams.get("url") || "").trim();

    if (!target || !target.startsWith("http")) {
      return new Response("Missing or invalid ?url=", { status: 400 });
    }

    // Resolve a SoundCloud URL (track/playlist/user) into an API object
    const api = new URL("https://api-v2.soundcloud.com/resolve");
    api.searchParams.set("url", target);
    api.searchParams.set("client_id", clientId);

    const r = await fetch(api.toString(), {
      headers: {
        "user-agent": "netlify-function",
        "accept": "application/json",
      },
    });

    const text = await r.text();
    if (!r.ok) {
      return new Response(text || `SoundCloud resolve failed (${r.status})`, { status: r.status });
    }

    return new Response(text, {
      status: 200,
      headers: { ...CORS, "cache-control": "no-store" },
    });
  } catch (err) {
    return new Response(`Function error: ${String(err?.message || err)}`, { status: 500 });
  }
};
