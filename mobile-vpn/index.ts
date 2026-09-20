// Polyfills requis AVANT tout usage du SDK Appwrite : React Native ne fournit
// nativement ni crypto.getRandomValues ni une implémentation complète de
// l'API URL/URLSearchParams (mêmes polyfills que mobile/index.ts).
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
