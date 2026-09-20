'use strict';
const env = require('./lib/env');
const { sign } = require('./lib/signature');
const wg = require('./lib/wireguard');

(async function() {
  try {
    console.log('[test] Generating keypair...');
    const { privateKey, publicKey } = wg.generateKeypair();
    console.log('[test] Generated public key:', publicKey.substring(0, 20) + '...');
    
    console.log('[test] Building config...');
    const clientConfig = wg.buildClientConfig({ privateKey, assignedIp: '10.66.0.99' });
    
    console.log('[test] Calling postProvisionResult...');
    const payload = {
      uid: 'test-uid-12345',
      wgPublicKey: publicKey,
      wgAssignedIp: '10.66.0.99',
      clientConfig: clientConfig
    };
    
    const rawBody = JSON.stringify(payload);
    const sig = sign(env.VPN_MANAGER_SECRET, rawBody);
    
    const res = await fetch(env.IXIN_BASE_URL.replace(/\/$/, '') + '/api/internal/vpn/provision-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-IXin-Signature': sig },
      body: rawBody
    });
    
    const json = await res.json().catch(() => ({}));
    console.log('[test] Response status:', res.status);
    console.log('[test] Response:', JSON.stringify(json));
    
    if (res.ok && json.ok) {
      console.log('[test] ✅ SUCCESS - Config should be stored in Appwrite now');
    } else {
      console.log('[test] ❌ FAILED');
    }
  } catch (e) {
    console.error('[test] Error:', e.message);
  }
})();
