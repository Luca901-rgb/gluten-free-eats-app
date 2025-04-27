
import { CapacitorConfig } from '@capacitor/cli';

// Simple timestamp for unique build
const buildTimestamp = new Date().getTime();

const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'localhost',
    iosScheme: 'https'
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
    overrideUserAgent: 'GlutenFreeEatsApp-' + buildTimestamp,
    minWebviewVersion: 60
  }
};

export default config;
