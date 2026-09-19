'use strict';
const wg = require('./wireguard');
const ixin = require('./ixinClient');

// La seule "vérité" côté planification : la liste d'abonnements actifs que
// renvoie IXin. Cette passe ne fait jamais confiance à un état local
// persistant propre à ce service — elle recalcule à chaque fois l'écart
// entre "qui devrait avoir accès" et "qui a effectivement un pair configuré
// sur wg0", et corrige dans les deux sens. Appelée par le minuteur
// périodique ET par POST /sync (le "maintenant" déclenché par le webhook
// Stripe d'IXin juste après un achat) — toujours le même code, jamais deux
// chemins qui pourraient diverger.
async function reconcile() {
  const entitlements = await ixin.getEntitlements();
  const localPeers = wg.listPeers();
  const localByKey = new Map(localPeers.map(function (p) { return [p.publicKey, p]; }));

  const usedIps = new Set();
  localPeers.forEach(function (p) { const ip = (p.allowedIps || '').split('/')[0]; if (ip) usedIps.add(ip); });
  entitlements.forEach(function (e) { if (e.wgAssignedIp) usedIps.add(e.wgAssignedIp); });

  let added = 0, removed = 0, reattached = 0;

  for (const ent of entitlements) {
    if (!ent.wgPublicKey) {
      // Jamais encore provisionné — génère une clé, l'ajoute côté serveur,
      // et livre la config complète (une seule fois, voir provision-result
      // côté worker.js) : le seul moment où la clé privée existe HORS de ce
      // process, c'est dans cet appel réseau signé.
      const { privateKey, publicKey } = wg.generateKeypair();
      const assignedIp = wg.nextFreeIp(usedIps);
      usedIps.add(assignedIp);
      wg.addPeer(publicKey, assignedIp);
      const clientConfig = wg.buildClientConfig({ privateKey: privateKey, assignedIp: assignedIp });
      await ixin.postProvisionResult({ uid: ent.uid, wgPublicKey: publicKey, wgAssignedIp: assignedIp, clientConfig: clientConfig });
      added++;
    } else if (!localByKey.has(ent.wgPublicKey)) {
      // Une clé existe déjà côté IXin mais pas localement (réinstallation de
      // ce service, ou pair retiré manuellement) — on la rattache telle
      // quelle : jamais une nouvelle paire de clés ici, l'abonné a déjà sa
      // config d'origine et n'a besoin de rien recevoir de nouveau.
      if (ent.wgAssignedIp) {
        wg.addPeer(ent.wgPublicKey, ent.wgAssignedIp);
        reattached++;
      }
    }
    // Sinon : déjà présent et correct, rien à faire.
  }

  const entitledKeys = new Set(entitlements.map(function (e) { return e.wgPublicKey; }).filter(Boolean));
  for (const peer of localPeers) {
    if (!entitledKeys.has(peer.publicKey)) {
      wg.removePeer(peer.publicKey);
      removed++;
    }
  }

  console.log('[vpn-manager] réconciliation : +' + added + ' nouveaux, ' + reattached + ' rattachés, -' + removed + ' retirés (sur ' + entitlements.length + ' abonnement(s) actif(s))');
  return { added: added, removed: removed, reattached: reattached, total: entitlements.length };
}

module.exports = { reconcile };
