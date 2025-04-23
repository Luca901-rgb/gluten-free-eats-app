
package com.glutenfreeeats.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Registriamo un listener per gestire meglio lo stato della connessione
        bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public void onPageFinished(android.webkit.WebView view, String url) {
                super.onPageFinished(view, url);
                bridge.getWebView().evaluateJavascript(
                    "window.navigator.connection = { online: true };", null);
            }
        });
    }
}
