
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
        // Register HTTP plugin before super call
        registerPlugin(com.capacitor.community.http.Http.class);
        
        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true);
        
        super.onCreate(savedInstanceState);
        
        // Timestamp to force cache refresh
        final long timestamp = new Date().getTime();
        
        // Aggressive non-caching settings for WebView
        bridge.getWebView().clearCache(true);
        bridge.getWebView().clearHistory();
        
        WebSettings webSettings = bridge.getWebView().getSettings();
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webSettings.setAppCacheEnabled(false);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        
        // Disable all caching
        webSettings.setGeolocationEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setGeolocationDatabasePath(getFilesDir().getPath());
        
        // Set unique UserAgent for each session
        String customUserAgent = webSettings.getUserAgentString() + " GlutenFreeApp/" + timestamp;
        webSettings.setUserAgentString(customUserAgent);
        
        // Force refresh with custom WebViewClient
        bridge.getWebView().setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                
                // Execute JavaScript to force data refresh
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
        
        // Force refresh every time app is opened
        bridge.getWebView().reload();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Reload WebView every time app resumes activity
        bridge.getWebView().reload();
    }
}
