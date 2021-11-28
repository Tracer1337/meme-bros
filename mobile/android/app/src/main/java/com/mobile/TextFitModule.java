package com.mobile;

import android.content.res.AssetManager;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.text.TextPaint;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.text.ReactFontManager;

import canvas.Canvas;

public class TextFitModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    TextFitModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "TextFitModule";
    }

    @ReactMethod
    public void fitText(ReadableMap options, Promise promise) {
        String text = options.getString("text");
        String fontFamily = options.getString("fontFamily");
        int fontWeight = getFontWeight(options.getString("fontWeight"));
        Container container = new Container(
                (float) options.getMap("containerRect").getDouble("width"),
                (float) options.getMap("containerRect").getDouble("height")
        );
        float low = (float) options.getDouble("low");
        float high = (float) options.getDouble("high");

        TextFitter textFitter = new TextFitter(fontFamily, fontWeight, container, low, high);
        float fontSize = textFitter.fitText(text);

        promise.resolve(fontSize);
    }

    @ReactMethod
    public void gomobile(String json, Promise promise) {
        String output = Canvas.generateFromJSON(json);
        promise.resolve(output);
    }

    private int getFontWeight(String fontWeight) {
        switch (fontWeight) {
            case "bold":
                return Typeface.BOLD;
            case "normal":
            default:
                return Typeface.NORMAL;
        }
    }

    private class TextFitter {
        private String fontFamily;
        private int fontWeight;
        private Container container;
        private float low;
        private float high;

        public TextFitter(
                String fontFamily,
                int fontWeight,
                Container container,
                float low,
                float high
        ) {
            this.fontFamily = fontFamily;
            this.fontWeight = fontWeight;
            this.container = container;
            this.low = low;
            this.high = high;
        }

        private float fitText(String text) {
            float fontSize = low;
            while (low <= high) {
                float mid = (float) Math.floor((high + low) / 2);
                Rect bounds = getTextBounds(text, mid);
                if (bounds.width() <= container.width() && bounds.height() <= container.height()) {
                    fontSize = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return fontSize;
        }

        private Rect getTextBounds(String text, float fontSize) {
            TextPaint paint = new TextPaint();
            initTextPaint(paint, fontSize);

            Rect bounds = new Rect();
            paint.getTextBounds(text, 0, text.length(), bounds);

            return bounds;
        }

        private void initTextPaint(TextPaint paint, float fontSize) {
            paint.setTextSize(fontSize * reactContext.getResources().getConfiguration().fontScale);
            AssetManager assetManager = getReactApplicationContext().getAssets();
            Typeface typeface = ReactFontManager.getInstance()
                    .getTypeface(fontFamily, fontWeight, assetManager);
            paint.setTypeface(typeface);
        }
    }

    private class Container {
        private float width;
        private float height;

        public Container(float width, float height) {
            this.width = width;
            this.height = height;
        }

        public float width() {
            return width;
        }

        public float height() {
            return height;
        }
    }

}
