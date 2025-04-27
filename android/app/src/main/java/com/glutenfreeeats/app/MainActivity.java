
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
        
        try {
            super.onCreate(savedInstanceState);
            
            Log.d(TAG, "MainActivity onCreate started");
            
            // Configure WebView if available
            if (bridge != null && bridge.getWebView() != null) {
                WebView webView = bridge.getWebView();
                
                // Clear any existing cache
                webView.clearCache(true);
                webView.clearHistory();
                
                WebSettings webSettings = webView.getSettings();
                webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
                webSettings.setJavaScriptEnabled(true);
                webSettings.setDomStorageEnabled(true);
                webSettings.setAllowFileAccess(true);
                webSettings.setAppCacheEnabled(false);
                
                // Set a simpler WebViewClient to avoid potential issues
                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        super.onPageFinished(view, url);
                        Log.d(TAG, "Page loaded: " + url);
                    }
                    
                    @Override
                    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                        super.onReceivedError(view, errorCode, description, failingUrl);
                        Log.e(TAG, "WebView error: " + errorCode + " " + description + " (" + failingUrl + ")");
                    }
                });
                
                Log.d(TAG, "WebView configured successfully");
            } else {
                Log.e(TAG, "Bridge or WebView is null");
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception during MainActivity initialization", e);
        }
    }
}
