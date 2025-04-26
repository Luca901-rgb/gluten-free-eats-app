
import { CapacitorConfig } from '@capacitor/cli';

// Add timestamp for unique build
const buildTimestamp = new Date().getTime();

const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true,
    // Force update by disabling cache
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
    // Add cache configuration
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
    // Force invalidation of cache
    overrideUserAgent: 'GlutenFreeEatsApp-' + buildTimestamp,
    minWebviewVersion: 60,
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keyAlias: undefined,
      keyPassword: undefined,
      releaseType: 'APK'
    },
    // Add configuration to force cache cleaning
    useLegacyBridge: false
  }
};

export default config;
