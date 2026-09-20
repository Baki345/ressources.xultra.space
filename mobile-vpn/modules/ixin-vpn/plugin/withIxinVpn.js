// Config plugin Expo — injecte dans AndroidManifest.xml (au moment de
// `expo prebuild`) la déclaration du VpnService interne à GoBackend (voir
// android/src/main/java/space/xultra/vpn/IxinVpnModule.kt). La dépendance
// Gradle vers com.wireguard.android:tunnel, elle, est déjà déclarée dans
// modules/ixin-vpn/android/build.gradle — l'autolinking Expo se charge du
// reste, aucune configuration supplémentaire n'est nécessaire ici.
const { withAndroidManifest } = require('@expo/config-plugins');

// Notation "classe interne" standard pour référencer GoBackend.VpnService
// (classe imbriquée) dans un AndroidManifest — même déclaration que l'appli
// WireGuard officielle pour son propre GoBackend.
const VPN_SERVICE_NAME = 'com.wireguard.android.backend.GoBackend$VpnService';

function withIxinVpn(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    if (!application.service) application.service = [];
    const alreadyDeclared = application.service.some(
      (service) => service.$ && service.$['android:name'] === VPN_SERVICE_NAME,
    );
    if (!alreadyDeclared) {
      application.service.push({
        $: {
          'android:name': VPN_SERVICE_NAME,
          'android:permission': 'android.permission.BIND_VPN_SERVICE',
          'android:exported': 'false',
        },
        'intent-filter': [
          {
            action: [{ $: { 'android:name': 'android.net.VpnService' } }],
          },
        ],
      });
    }
    return config;
  });
}

module.exports = withIxinVpn;
