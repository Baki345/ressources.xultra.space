package space.xultra.vpn

// ⚠️ Écrit à partir de la documentation/API publique de com.wireguard.android
// (GoBackend/Tunnel/Config) et de l'Expo Modules API — jamais compilé dans ce
// bac à sable (pas de SDK Android/Gradle avec accès Maven Central ici, voir
// le plan). Structurellement correct au mieux de ce qui est vérifiable sans
// compilation réelle ; à valider par un vrai build (`expo prebuild` puis
// `./gradlew assembleDebug`) avant de faire confiance à ce fichier en
// production — même réserve que desktop/src/vpn/platform/win32.js, jamais
// testé sur vraie machine Windows.
import android.app.Activity
import android.content.Context
import com.wireguard.android.backend.GoBackend
import com.wireguard.android.backend.Tunnel
import com.wireguard.config.Config
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.BufferedReader
import java.io.StringReader

// Valeur arbitraire mais fixe, seulement utile pour distinguer ce résultat
// d'activité d'un autre si jamais un futur module en ajoutait — ce module-ci
// n'en lance jamais qu'une.
private const val VPN_PERMISSION_REQUEST_CODE = 4919

class IxinVpnModule : Module() {
  // Un seul tunnel nommé pour toute l'appli — une seule connexion possible à
  // la fois, comme le desktop (une seule interface ixin0). Cette
  // implémentation Tunnel ne fait que porter le nom et relayer les
  // changements d'état vers l'évènement JS onStatusChange.
  private val tunnel = object : Tunnel {
    override fun getName(): String = "ixin0"
    override fun onStateChange(newState: Tunnel.State) {
      emitCurrentStatus()
    }
  }

  // GoBackend gère lui-même son propre android.net.VpnService interne
  // (GoBackend.VpnService, déclaré dans AndroidManifest.xml par
  // plugin/withIxinVpn.js) — ce module ne pilote jamais un VpnService à la
  // main, uniquement via cette bibliothèque officielle WireGuard-for-Android
  // (même logique que le desktop, qui enveloppe le binaire officiel
  // wireguard-go plutôt que réimplémenter WireGuard soi-même).
  private val backend: GoBackend by lazy {
    GoBackend(requireContext())
  }

  private var lastError: String? = null
  private var pendingPermissionPromise: Promise? = null

  private fun requireContext(): Context =
    appContext.reactContext ?: throw IllegalStateException("Aucun contexte Android disponible.")

  override fun definition() = ModuleDefinition {
    Name("IxinVpn")

    Events("onStatusChange")

    // Mécanisme standard de l'Expo Modules API pour un flux
    // startActivityForResult()/onActivityResult() lancé depuis un module
    // natif — la Promise est résolue ici plutôt que dans requestPermission()
    // elle-même, qui ne fait que démarrer l'activité système.
    OnActivityResult { _, result ->
      val promise = pendingPermissionPromise
      pendingPermissionPromise = null
      promise?.resolve(result.resultCode == Activity.RESULT_OK)
    }

    // Déclenche la boîte de dialogue système "Cette appli veut configurer
    // une connexion VPN" (VpnService.prepare()) — uniquement la 1ère fois,
    // ou si l'utilisateur a révoqué la permission depuis les réglages
    // système. Résout directement à true si déjà accordée, sans jamais
    // rouvrir cette boîte de dialogue pour rien.
    AsyncFunction("requestPermission") { promise: Promise ->
      val intent = GoBackend.VpnService.prepare(requireContext())
      if (intent == null) {
        promise.resolve(true)
        return@AsyncFunction
      }
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ixin_vpn_no_activity", "Aucune activité au premier plan pour demander la permission VPN.", null)
        return@AsyncFunction
      }
      pendingPermissionPromise = promise
      activity.startActivityForResult(intent, VPN_PERMISSION_REQUEST_CODE)
    }

    // confText : texte brut du .conf WireGuard, jamais reparsé côté JS — la
    // bibliothèque WireGuard elle-même sait déjà lire un .conf standard via
    // Config.parse(), contrairement au desktop où confParser.js existe
    // seulement parce que wireguard-go parle UAPI brut, pas texte .conf.
    // killSwitch n'est PAS appliqué ici : voir la note d'honnêteté dans
    // ConnectScreen.tsx — Android n'autorise pas une appli tierce à
    // l'activer silencieusement, seul l'utilisateur le peut depuis Réglages.
    AsyncFunction("connect") { confText: String, killSwitch: Boolean, promise: Promise ->
      try {
        val config = Config.parse(BufferedReader(StringReader(confText)))
        backend.setState(tunnel, Tunnel.State.UP, config)
        lastError = null
        emitCurrentStatus()
        promise.resolve(null)
      } catch (e: Exception) {
        lastError = e.message ?: "Connexion VPN impossible."
        emitCurrentStatus()
        promise.reject("ixin_vpn_connect_failed", lastError, e)
      }
    }

    AsyncFunction("disconnect") { promise: Promise ->
      try {
        backend.setState(tunnel, Tunnel.State.DOWN, null)
        lastError = null
        emitCurrentStatus()
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("ixin_vpn_disconnect_failed", e.message ?: "Déconnexion impossible.", e)
      }
    }

    AsyncFunction("getStatus") { promise: Promise ->
      promise.resolve(buildStatusMap())
    }
  }

  private fun emitCurrentStatus() {
    sendEvent("onStatusChange", buildStatusMap())
  }

  private fun buildStatusMap(): Map<String, Any?> {
    val state = try { backend.getState(tunnel) } catch (e: Exception) { Tunnel.State.DOWN }
    var rxBytes = 0L
    var txBytes = 0L
    var lastHandshakeSec = 0L
    if (state == Tunnel.State.UP) {
      try {
        val stats = backend.getStatistics(tunnel)
        val peerKey = stats.peers().firstOrNull()
        val peerStats = peerKey?.let { stats.peer(it) }
        if (peerStats != null) {
          rxBytes = peerStats.rxBytes
          txBytes = peerStats.txBytes
          lastHandshakeSec = peerStats.latestHandshakeEpochMillis / 1000L
        }
      } catch (e: Exception) {
        // Une lecture de statistiques ratée ne doit jamais faire échouer tout
        // l'état renvoyé — mêmes valeurs à 0 qu'une connexion qui vient de
        // démarrer, cohérent avec le comportement déjà attendu côté UI.
      }
    }
    return mapOf(
      "state" to when {
        state == Tunnel.State.UP -> "connected"
        lastError != null -> "error"
        else -> "disconnected"
      },
      "rxBytes" to rxBytes,
      "txBytes" to txBytes,
      "lastHandshakeSec" to lastHandshakeSec,
      "error" to lastError
    )
  }
}
