package com.mobile;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import api.Api;

public class CoreModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public CoreModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "CoreModule";
    }

    @ReactMethod
    public void generate(String json, Promise promise) {
        String output = Api.generateFromJSON(json);
        promise.resolve(output);
    }

    @ReactMethod
    public void textfit(String text, String fontFamily, float width, float height, Promise promise) {
        long t0 = System.nanoTime();
        double output = Api.fitText(text, fontFamily, width, height);
        long elapsed = System.nanoTime() - t0;
        Log.d("Textfit", Long.toString(elapsed));
        promise.resolve(output);
    }
}
