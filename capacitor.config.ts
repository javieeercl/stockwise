import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alimentosfrescosdelsur.stockwise', // Cambia a tu ID correcto
  appName: 'stockwise',
  webDir: 'www',
  bundledWebRuntime: false,

  android: {
    allowMixedContent: true, // Permitir contenido mixto (útil si tienes recursos HTTP y HTTPS)
    backgroundColor: '#ffffff', // Color de fondo de la pantalla de carga en Android
    webContentsDebuggingEnabled: true, // Habilitar depuración web para Android
  },

  server: {
    cleartext: true, // Permite HTTP en lugar de HTTPS (solo para desarrollo)
    androidScheme: 'https', // Usar 'https' para servir el contenido en Android
  },

  cordova: {
    preferences: {
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    }
  }
};

export default config;
