
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0406988df72c4fb89c66f80fcfc8a946',
  appName: 'gluten-free-eats-app',
  webDir: 'dist',
  server: {
    url: 'https://0406988d-f72c-4fb8-9c66-f80fcfc8a946.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff"
    }
  }
};

export default config;
