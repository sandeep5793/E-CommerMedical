// ToastModule.java

package com.arascamedicalgroup;

import android.content.Intent;
import android.widget.Toast;

import com.arascamedicalgroup.paymentmodule.MainActivity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.util.Map;
import java.util.HashMap;

public class ToastModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
  public static  Callback callbackobject;
  public static  Callback failcallbackobject;

  ToastModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(int message, int duration) {



    //Toast.makeText(getReactApplicationContext(), message, duration).show();
  }


  @ReactMethod
  public void merchantFunction(String merchantId, String region, String merchandServerUrl, String amount, Callback errorCallback,
                               Callback successCallback) {

    try {
      successCallback.invoke("On Success Called");
    } catch (IllegalViewOperationException e) {
      errorCallback.invoke(e.getMessage());
    }
    //Toast.makeText(getReactApplicationContext(), message, duration).show();
  }


  @ReactMethod
  public void measureLayout(
          String merchantId, String region, String merchandServerUrl, String amount, String orderId,
          Callback errorCallback,
          Callback successCallback) {
    try {
      callbackobject = successCallback;
      failcallbackobject = errorCallback;
      Intent i = new Intent(reactContext, MainActivity.class);
      i.putExtra("merchantId",merchantId);
      i.putExtra("region",region);
      i.putExtra("merchandServerUrl",merchandServerUrl);
      i.putExtra("amount",amount);
      i.putExtra("orderId",orderId);
      i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      reactContext.startActivity(i);
    } catch (IllegalViewOperationException e) {
      failcallbackobject.invoke(e.getMessage());
    }
  }


  @Override
  public String getName() {
    return "ToastExample";
  }
}