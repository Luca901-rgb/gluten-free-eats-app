
package com.glutenfreeeats.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registriamo il plugin HTTP prima di chiamare il metodo super
        registerPlugin(com.getcapacitor.community.http.Http.class);
        
        // Impostazioni di debug per il WebView
        WebView.setWebContentsDebuggingEnabled(true);
        
        super.onCreate(savedInstanceState);
        
        // Impostazioni aggressive di non-caching per il WebView
        bridge.getWebView().clearCache(true);
        bridge.getWebView().clearHistory();
        
        WebSettings webSettings = bridge.getWebView().getSettings();
        webSettings.setCacheMode(WebView.LOAD_NO_CACHE);
        webSettings.setAppCacheEnabled(false);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        
        // Disabilita ogni tipo di caching
        webSettings.setGeolocationEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setGeolocationDatabasePath(getFilesDir().getPath());
        
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
