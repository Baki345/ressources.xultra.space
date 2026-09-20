'use strict';
const env = require('./lib/env');
const { getEntitlements } = require('./lib/ixinClient');

(async function() {
  try {
    console.log('[test] Calling getEntitlements...');
    const ents = await getEntitlements();
    console.log('[test] Success! Got ' + ents.length + ' entitlements');
    ents.forEach(function(e) {
      console.log('[test]   - uid:', e.uid, 'wgPublicKey:', e.wgPublicKey ? 'yes' : 'no', 'status:', e.status);
    });
  } catch (e) {
    console.error('[test] Failed:', e.message);
  }
})();
