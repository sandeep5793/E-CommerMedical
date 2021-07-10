package com.arascamedicalgroup.paymentmodule;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.mastercard.gateway.android.sdk.Gateway;

public enum Config {


    //These Are The Credentials i'm using to log into app
    //First step will be to create Session


    MERCHANT_ID("120810000016"),
    REGION(Gateway.Region.EUROPE.name()),
    //        I also implemented it for different regions like ::
    //        ASIA_PACIFIC("ap."),
    //        EUROPE("eu."),
    //        NORTH_AMERICA("na."),
    //        INDIA("in."),
    //        CHINA("cn."),
    //        MTF("mtf.");
    MERCHANT_URL("https://arasca-modif.herokuapp.com/");

    //        I have also checked::  https://test-adcb.mtf.gateway.mastercard.com/ma





    String defValue;

    Config(String defValue) {
        this.defValue = defValue;
    }

    public String getValue(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getString(this.name(), defValue);
    }

    public void setValue(Context context, String value) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(this.name(), value);
        editor.apply();
    }
}
