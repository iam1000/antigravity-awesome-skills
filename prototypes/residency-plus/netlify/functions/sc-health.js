const CORS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: CORS });
  }

  const v = process.env.SOUNDCLOUD_CLIENT_ID;
  const missing = !v || v.trim() === "" || v === "YOUR_CLIENT_ID";

  return new Response(JSON.stringify({ 
    ok: !missing,
    message: missing ? "Missing or placeholder SOUNDCLOUD_CLIENT_ID" : "Healthy"
  }), {
    status: 200,
    headers: CORS
  });
};
