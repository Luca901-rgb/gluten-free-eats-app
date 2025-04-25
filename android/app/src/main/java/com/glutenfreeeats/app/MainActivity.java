
package com.glutenfreeeats.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Registriamo il plugin HTTP prima di chiamare il metodo super
        registerPlugin(com.getcapacitor.community.http.Http.class);
        
        // Imposta l'app per non utilizzare la cache del WebView
        WebView.setWebContentsDebuggingEnabled(true);
        
        super.onCreate(savedInstanceState);
        
        // Cancella la cache del WebView all'avvio
        bridge.getWebView().clearCache(true);
        bridge.getWebView().getSettings().setCacheMode(WebView.LOAD_NO_CACHE);
        bridge.getWebView().getSettings().setAppCacheEnabled(false);
    }
}
