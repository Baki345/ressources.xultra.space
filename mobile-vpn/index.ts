import { registerRootComponent } from 'expo';
import App from './App';

try {
  registerRootComponent(App);
} catch (e) {
  console.error('[index.ts] Fatal error:', e);
}
