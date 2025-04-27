
package com.glutenfreeeats.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.util.Log;
import java.util.Date;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "GlutenFreeEats";
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register HTTP plugin before super call
        registerPlugin(com.capacitor.community.http.Http.class);
        
        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true);
        
        try {
            super.onCreate(savedInstanceState);
            
            // Timestamp to force cache refresh
            final long timestamp = new Date().getTime();
            
            Log.d(TAG, "Initializing WebView with cache clearing");
            
            // Ensure WebView is properly initialized
            if (bridge != null && bridge.getWebView() != null) {
                // Clear WebView cache
                bridge.getWebView().clearCache(true);
                bridge.getWebView().clearHistory();
                
                WebSettings webSettings = bridge.getWebView().getSettings();
                webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
                webSettings.setAppCacheEnabled(false);
                webSettings.setDomStorageEnabled(true);
                webSettings.setDatabaseEnabled(true);
                
                // Enable JavaScript and other required settings
                webSettings.setJavaScriptEnabled(true);
                webSettings.setDomStorageEnabled(true);
                webSettings.setAllowFileAccess(true);
                
                // Set unique UserAgent to bypass cache
                String customUserAgent = webSettings.getUserAgentString() + " GlutenFreeApp/" + timestamp;
                webSettings.setUserAgentString(customUserAgent);
                
                Log.d(TAG, "Setting custom user agent: " + customUserAgent);
                
                // Use a simple WebViewClient - the complex one might be causing issues
                bridge.getWebView().setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        super.onPageFinished(view, url);
                        Log.d(TAG, "Page loaded: " + url);
                        
                        // Simple script to clear storage without complex logic
                        view.evaluateJavascript(
                            "localStorage.clear(); sessionStorage.clear(); console.log('Storage cleared');", 
                            null
                        );
                    }
                });
                
                Log.d(TAG, "WebView initialization complete");
            } else {
                Log.e(TAG, "WebView or bridge is null");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error during MainActivity initialization", e);
        }
    }
    
    @Override
    public void onResume() {
        try {
            super.onResume();
            
            // Use lighter approach - only reload if needed
            if (bridge != null && bridge.getWebView() != null) {
                Log.d(TAG, "Activity resumed, reloading WebView");
                bridge.getWebView().reload();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error during onResume", e);
        }
    }
}
