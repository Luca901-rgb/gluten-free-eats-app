
package com.glutenfreeeats.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import java.util.Date;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registriamo il plugin HTTP prima di chiamare il metodo super
        registerPlugin(com.capacitor.community.http.Http.class);
        
        // Impostazioni di debug per il WebView
        WebView.setWebContentsDebuggingEnabled(true);
        
        super.onCreate(savedInstanceState);
        
        // Timestamp per forzare il refreshing della cache
        final long timestamp = new Date().getTime();
        
        // Impostazioni aggressive di non-caching per il WebView
        bridge.getWebView().clearCache(true);
        bridge.getWebView().clearHistory();
        
        WebSettings webSettings = bridge.getWebView().getSettings();
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webSettings.setAppCacheEnabled(false);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        
        // Disabilita ogni tipo di caching
        webSettings.setGeolocationEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setGeolocationDatabasePath(getFilesDir().getPath());
        
        // Imposta un UserAgent univoco per ogni sessione
        String customUserAgent = webSettings.getUserAgentString() + " GlutenFreeApp/" + timestamp;
        webSettings.setUserAgentString(customUserAgent);
        
        // Forza il refresh con un custom WebViewClient
        bridge.getWebView().setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                
                // Esegue JavaScript per forzare il refresh dei dati
                String refreshScript = 
                    "try {" +
                    "  localStorage.clear();" +
                    "  sessionStorage.clear();" +
                    "  console.log('Storage cleared by native layer');" +
                    "  if (typeof window.refreshRestaurants === 'function') {" +
                    "    window.refreshRestaurants();" +
                    "    console.log('Restaurant data refreshed');" +
                    "  }" +
                    "} catch(e) { console.error('Error in refresh script:', e); }";
                
                view.evaluateJavascript(refreshScript, null);
            }
        });
        
        // Forza il refresh ogni volta che l'app viene aperta
        bridge.getWebView().reload();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Ricarica la WebView ogni volta che l'app riprende l'attività
        bridge.getWebView().reload();
    }
}
