
package com.glutenfreeeats.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(com.getcapacitor.community.http.Http.class);
        super.onCreate(savedInstanceState);
    }
}
