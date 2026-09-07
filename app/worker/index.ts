export interface Env {
  // Les futurs secrets/bindings (AW_ADMIN_KEY, etc.) seront déclarés ici au
  // fur et à mesure qu'une section réelle est migrée — rien n'est câblé pour
  // l'instant, ce Worker ne fait que prouver que la chaîne de build/déploiement
  // fonctionne avant d'y mettre la moindre logique métier.
}

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, service: 'xultra-app-preview' });
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    // Toute autre requête retombe sur les assets statiques (le build React),
    // géré automatiquement par le binding "assets" de wrangler.jsonc.
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
