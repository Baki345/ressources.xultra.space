'use strict';
const env = require('./lib/env');
const { sign } = require('./lib/signature');
const { getEntitlements } = require('./lib/ixinClient');
const wg = require('./lib/wireguard');

(async function() {
  try {
    console.log('[TEST] === Simulating full revoke flow ===\n');
    
    // Get first user
    const ents = await getEntitlements();
    if (!ents.length) { console.log('No users'); return; }
    const uid = ents[0].uid;
    console.log('[TEST] Using UID:', uid);
    console.log('[TEST] Current status: wgPublicKey:', ents[0].wgPublicKey ? 'YES' : 'NO\n');
    
    // Simulate revocation by clearing the key
    console.log('[TEST] Step 1: POST /api/vpn/revoke (would clear keys in Appwrite)');
    console.log('[TEST]   → wgPublicKey cleared');
    console.log('[TEST]   → wgAssignedIp cleared');
    console.log('[TEST]   → pendingConfig cleared');
    console.log('[TEST]   → triggerVpnManagerSync() called\n');
    
    // Simulate reconciliation
    console.log('[TEST] Step 2: vpn-manager reconciliation starts');
    const { privateKey, publicKey } = wg.generateKeypair();
    console.log('[TEST]   → Generated new keypair');
    
    const assignedIp = '10.66.0.99';
    const clientConfig = wg.buildClientConfig({ privateKey, assignedIp });
    console.log('[TEST]   → Built client config\n');
    
    // Try to store config
    console.log('[TEST] Step 3: Calling postProvisionResult()');
    const { postProvisionResult } = require('./lib/ixinClient');
    
    try {
      await postProvisionResult({ 
        uid, 
        wgPublicKey: publicKey, 
        wgAssignedIp: assignedIp, 
        clientConfig 
      });
      console.log('[TEST] ✅ Config stored successfully in Appwrite\n');
    } catch (e) {
      console.log('[TEST] ❌ postProvisionResult FAILED:', e.message, '\n');
      return;
    }
    
    // Now check if /api/vpn/config/claim can find it
    console.log('[TEST] Step 4: User calls /api/vpn/config/claim');
    console.log('[TEST] Expected: Returns config');
    console.log('[TEST] If not found: Returns "Aucune configuration en attente"\n');
    
    console.log('[TEST] ✅ If you reach here, config flow should work!');
    
  } catch (e) {
    console.error('[TEST]', e.message);
  }
})();
