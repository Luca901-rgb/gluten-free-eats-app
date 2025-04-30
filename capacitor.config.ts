import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glutenfreeeats.app',
  appName: 'Gluten Free Eats',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    // ✅ Se usi un dev server (es: Vite), decommenta e modifica con l'IP corretto
    // url: 'http://10.0.2.2:5173'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      launchAutoHide: true,
      splashFullScreen: true,
      splashImmersive: false
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    initialFocus: true
  },
  ios: {
    contentInset: "always",
    cordovaSwiftVersion: "5.1",
    preferredContentMode: "mobile"
  }
};

export default config;
