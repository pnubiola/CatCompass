package cat.nubiola.catcompass;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final Activity activity = this;
        setContentView(R.layout.activity_main);
        WebView compass = (WebView) findViewById(R.id.TestCompass);
        compass.getSettings().setJavaScriptEnabled(true);
        compass.getSettings().setDomStorageEnabled(true);
        compass.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {
            }
        });
        compass.loadUrl("file:///android_asset/Compass.html");
    }
}