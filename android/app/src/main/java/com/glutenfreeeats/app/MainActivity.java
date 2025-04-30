
package com.glutenfreeeats.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;
import android.util.Log;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private WebView webView = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configura il bridge e lascia che si inizializzi correttamente
        // NON manipolare la WebView qui
    }
    
    @Override
    public void onStart() {
        super.onStart();
        
        try {
            // Ora è sicuro accedere alla WebView, dopo che il Bridge è stato inizializzato
            if (getBridge() != null && getBridge().getWebView() != null) {
                webView = getBridge().getWebView();
                webView.clearCache(true);
                webView.clearHistory();
                
                WebSettings webSettings = webView.getSettings();
                webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
                
                // Nota: disabilitare DOMStorage potrebbe causare problemi con molte app web
                // Consiglio di mantenere queste impostazioni abilitate
                webSettings.setDomStorageEnabled(true);
                webSettings.setDatabaseEnabled(true);
            }
        } catch (Exception e) {
            Log.e(TAG, "Errore durante la configurazione della WebView", e);
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        
        try {
            // Assicurati che il bridge sia inizializzato prima di usare la WebView
            if (getBridge() != null && getBridge().getWebView() != null) {
                if (webView != null) {
                    webView.reload();
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Errore durante il reload della WebView", e);
        }
    }
    
    @Override
    public void onDestroy() {
        try {
            // Rilascia esplicitamente la WebView per evitare memory leak
            if (webView != null) {
                webView.stopLoading();
                webView.clearHistory();
                webView.clearCache(true);
                webView.clearFormData();
                webView.destroy();
                webView = null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Errore durante la pulizia della WebView", e);
        }
        super.onDestroy();
    }
}
