addEventListener("fetch",e=>e.respondWith(handle(e.request)));
async function handle(request){
  const path=new URL(request.url).pathname.replace(/\/+$/,"")||"/";
  const html=path==="/app"?APP:HOME;
  return new Response(html,{status:200,headers:{
    "Content-Type":"text/html;charset=utf-8",
    "Cache-Control":"no-store,no-cache,must-revalidate",
    "X-Content-Type-Options":"nosniff",
    "X-Frame-Options":"DENY",
    "Referrer-Policy":"strict-origin-when-cross-origin",
    "Permissions-Policy":"camera=(self),microphone=(self),display-capture=(self)",
    "Strict-Transport-Security":"max-age=31536000;includeSubDomains",
    "Cross-Origin-Opener-Policy":"same-origin",
    "Cross-Origin-Resource-Policy":"same-origin",
    "Content-Security-Policy":"default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; connect-src 'self' https://fra.cloud.appwrite.io https://*.cloud.appwrite.io https://api.giphy.com https://api.imgbb.com https://buy.stripe.com https://*.stripe.com https://api.coinbase.com https://mempool.space https://api.blockcypher.com https://api.languagetool.org https://*.trycloudflare.com wss://*.trycloudflare.com wss://journal-bernard-alarm-walking.trycloudflare.com; img-src 'self' data: blob: https:; media-src 'self' blob: https:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  }});
}
