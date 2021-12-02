package com.mobile;

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
        double output = Api.fitText(text, fontFamily, width, height);
        promise.resolve(output);
    }
}
