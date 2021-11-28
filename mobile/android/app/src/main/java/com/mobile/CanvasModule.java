package com.mobile;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import canvas.Canvas;

public class CanvasModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public CanvasModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "CanvasModule";
    }

    @ReactMethod
    public void generate(String json, Promise promise) {
        String output = Canvas.generateFromJSON(json);
        promise.resolve(output);
    }
}
