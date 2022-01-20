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
    public void render(String json, Promise promise) {
        String output = Api.renderFromJSON(json);
        promise.resolve(output);
    }
}
