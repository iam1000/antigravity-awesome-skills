exports.handler = async () => {
  const id = process.env.SOUNDCLOUD_CLIENT_ID;
  const ok = !!id && id.trim() !== "" && id !== "YOUR_CLIENT_ID";
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET,POST,OPTIONS",
    },
    body: JSON.stringify({
      ok,
      message: ok
        ? "SoundCloud client id detected."
        : "Missing SOUNDCLOUD_CLIENT_ID. Set it in your shell or Netlify env vars (see .env.example).",
    }),
  };
};
