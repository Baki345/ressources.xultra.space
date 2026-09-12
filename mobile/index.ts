// Polyfills globaux requis AVANT tout usage du SDK Appwrite ou du module E2E
// (src/e2e.ts) : React Native ne fournit nativement ni crypto.getRandomValues
// (nécessaire à @noble/curves comme à Appwrite) ni une implémentation
// complète de l'API URL/URLSearchParams utilisée par react-native-appwrite.
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
