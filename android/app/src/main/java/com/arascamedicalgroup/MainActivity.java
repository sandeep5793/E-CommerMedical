package com.arascamedicalgroup;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // import this

import android.content.Intent;
import android.os.Handler;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */

  Handler handler = new Handler();

  public void afficher() {
//    SplashScreen.hide(this);
//    setTheme(R.style.AppTheme);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
   SplashScreen.show(this); // here
    super.onCreate(savedInstanceState);
//    handler.postDelayed(new Runnable() {
//      public void run() {
//        afficher();
//      }
//    }, 4000);
  }

  @Override
  protected String getMainComponentName() {
    return "ArascaMedical";
  }

}
