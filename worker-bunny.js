export default {
  async fetch(request, env) {
    function corsHeaders() {
      return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400"
      };
    }
    function json(obj, status) {
      status = status || 200;
      var h = corsHeaders();
      h["Content-Type"] = "application/json";
      return new Response(JSON.stringify(obj), { status: status, headers: h });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return json({ error: "POST only" }, 405);
    }

    try {
      var zone = env.BUNNY_STORAGE_ZONE;
      var key = env.BUNNY_ACCESS_KEY;
      var cdn = (env.BUNNY_CDN_HOST || "").replace(/\/$/, "");
      var storageHost = (env.BUNNY_STORAGE_HOST || "storage.bunnycdn.com").replace(/^https?:\/\//, "");
      var maxMb = Number(env.MAX_UPLOAD_MB || 200);

      if (!zone || !key || !cdn) {
        return json({
          error: "Config Bunny incomplete",
          need: ["BUNNY_STORAGE_ZONE", "BUNNY_ACCESS_KEY", "BUNNY_CDN_HOST"]
        }, 500);
      }

      var form = await request.formData();
      var file = form.get("file");
      if (!file || typeof file === "string") {
        return json({ error: "Champ file manquant" }, 400);
      }

      var size = Number(file.size || 0);
      if (size > maxMb * 1024 * 1024) {
        return json({ error: "Fichier trop lourd (max " + maxMb + " Mo)", maxMb: maxMb, size: size }, 413);
      }

      var folder = String(form.get("folder") || "misc").replace(/[^\w\-]+/g, "") || "misc";
      var uid = String(form.get("uid") || "anon").replace(/[^\w\-]+/g, "").slice(0, 64) || "anon";
      var rawName = String(file.name || "file");
      var name = rawName.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "file";
      var path = folder + "/" + uid + "/" + Date.now() + "_" + name;

      var buf = await file.arrayBuffer();
      var putUrl = "https://" + storageHost + "/" + zone + "/" + path;
      var put = await fetch(putUrl, {
        method: "PUT",
        headers: {
          AccessKey: key,
          "Content-Type": file.type || "application/octet-stream"
        },
        body: buf
      });

      if (!put.ok) {
        var t = await put.text();
        return json({ error: "Bunny HTTP " + put.status, detail: String(t).slice(0, 300) }, 502);
      }

      var url = cdn + "/" + path;
      return json({ url: url, path: path, provider: "bunny", size: size, maxMb: maxMb }, 200);
    } catch (e) {
      return json({ error: String(e && e.message ? e.message : e) }, 500);
    }
  }
};
