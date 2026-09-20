// Enveloppe JS du module natif Kotlin (android/src/.../IxinVpnModule.kt), lui-
// même une fine couche autour de com.wireguard.android:tunnel (la
// bibliothèque officielle WireGuard-for-Android — même logique que le
// desktop, qui enveloppe le binaire officiel wireguard-go plutôt que
// réimplémenter WireGuard soi-même). Android uniquement — voir
// expo-module.config.json.
import { requireNativeModule, type EventSubscription } from 'expo-modules-core';

export type VpnState = 'disconnected' | 'connecting' | 'connected' | 'error';

export type VpnStatus = {
  state: VpnState;
  rxBytes: number;
  txBytes: number;
  lastHandshakeSec: number;
  error?: string;
};

type IxinVpnEvents = {
  onStatusChange: (status: VpnStatus) => void;
};

// Depuis le SDK 52, un module natif exposant Events(...) dans sa
// ModuleDefinition kotlin est DÉJÀ un EventEmitter au runtime (addListener
// inclus) — cette forme déclare directement ce que ça expose plutôt que
// d'intersecter avec la classe EventEmitter générique importée, dont la
// résolution de type par intersection s'est révélée peu fiable ici.
type IxinVpnNativeModule = {
  addListener<EventName extends keyof IxinVpnEvents>(
    eventName: EventName,
    listener: IxinVpnEvents[EventName],
  ): EventSubscription;
  // Déclenche la boîte de dialogue système "Cette appli veut configurer une
  // connexion VPN" (VpnService.prepare()) — uniquement la 1ère fois, ou si
  // l'utilisateur l'a révoquée depuis les réglages système. Renvoie true si
  // déjà accordée ou accordée à l'instant, false si refusée.
  requestPermission(): Promise<boolean>;
  // confText : texte brut du .conf WireGuard, jamais reparsé côté JS — le
  // module natif le fait via com.wireguard.config.Config.parse(), qui sait
  // déjà lire un .conf standard.
  connect(confText: string, killSwitch: boolean): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<VpnStatus>;
};

const NativeModule = requireNativeModule<IxinVpnNativeModule>('IxinVpn');

export function requestPermission(): Promise<boolean> {
  return NativeModule.requestPermission();
}

export function connect(confText: string, killSwitch: boolean): Promise<void> {
  return NativeModule.connect(confText, killSwitch);
}

export function disconnect(): Promise<void> {
  return NativeModule.disconnect();
}

export function getStatus(): Promise<VpnStatus> {
  return NativeModule.getStatus();
}

// Même contrat de forme que l'évènement 'status' de VpnManager côté desktop
// (desktop/src/vpn/manager.js) — les deux apps peuvent donc partager une
// logique d'affichage de statut quasi identique malgré un transport natif
// totalement différent.
export function onStatusChange(listener: (status: VpnStatus) => void): EventSubscription {
  return NativeModule.addListener('onStatusChange', listener);
}
