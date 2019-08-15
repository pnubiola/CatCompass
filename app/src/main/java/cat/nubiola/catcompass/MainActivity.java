/*

   	Copyright 2019 Pere Nubiola

    This file is part of CatCompass.

    CatCompass is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CatCompass is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CatCompass.  If not, see <https://www.gnu.org/licenses/>.
*/
package cat.nubiola.catcompass;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
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