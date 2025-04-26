
import { CapacitorConfig } from '@capacitor/cli';

// Aggiungiamo un timestamp per rendere ogni build unica
const buildTimestamp = new Date().getTime();

const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true,
    // Forza aggiornamento disabilitando la cache
    hostname: 'localhost',
    iosScheme: 'https',
    originalUrl: 'https://glutenfreeeats.app',
    errorPath: './error.html'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidScaleType: "CENTER_CROP",
      launchAutoHide: true,
      showSpinner: true,
      spinnerColor: "#FF5733"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    // Aggiungiamo configurazione per la cache
    CapacitorHttp: {
      enabled: true
    },
    WebView: {
      allowFileAccess: true,
      allowFileAccessFromFileURLs: true,
      allowUniversalAccessFromFileURLs: true,
      webContentsDebuggingEnabled: true
    }
  },
  android: {
    backgroundColor: "#FFFFFF",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // Forza l'invalidazione della cache
    overrideUserAgent: 'GlutenFreeEatsApp-' + buildTimestamp,
    minWebviewVersion: 60,
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keyAlias: undefined,
      keyPassword: undefined,
      releaseType: 'APK'
    },
    // Aggiungiamo anche qui una configurazione per forzare la pulizia della cache
    useLegacyBridge: false
  }
};

export default config;
