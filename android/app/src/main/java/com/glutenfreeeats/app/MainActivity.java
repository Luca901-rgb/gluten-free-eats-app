
package com.glutenfreeeats.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "GlutenFreeEats";
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        try {
            // Registriamo il plugin HTTP prima della chiamata super
            registerPlugin(com.capacitor.community.http.Http.class);
            
            super.onCreate(savedInstanceState);
            
            Log.d(TAG, "MainActivity onCreate iniziato");
            
            if (bridge != null && bridge.getWebView() != null) {
                WebView webView = bridge.getWebView();
                
                // Pulizia completa della cache
                webView.clearCache(true);
                webView.clearHistory();
                
                WebSettings webSettings = webView.getSettings();
                webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
                webSettings.setJavaScriptEnabled(true);
                webSettings.setDomStorageEnabled(true);
                webSettings.setAllowFileAccess(true);
                webSettings.setAppCacheEnabled(false);
                webSettings.setMediaPlaybackRequiresUserGesture(false);
                
                // WebViewClient semplificato con gestione degli errori migliorata
                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        super.onPageFinished(view, url);
                        Log.d(TAG, "Pagina caricata: " + url);
                    }
                    
                    @Override
                    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                        super.onReceivedError(view, errorCode, description, failingUrl);
                        Log.e(TAG, "Errore WebView: " + errorCode + " " + description + " (" + failingUrl + ")");
                    }
                });
                
                Log.d(TAG, "WebView configurato con successo");
            } else {
                Log.e(TAG, "Bridge o WebView è null");
            }
        } catch (Exception e) {
            Log.e(TAG, "Eccezione durante l'inizializzazione di MainActivity", e);
        }
    }
}
