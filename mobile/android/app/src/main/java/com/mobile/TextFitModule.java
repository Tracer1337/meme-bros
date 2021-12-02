package com.mobile;

import android.content.res.AssetManager;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.text.TextPaint;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.text.ReactFontManager;

import java.util.ArrayList;
import java.util.List;

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

        float fontSize = new TextFitter(fontFamily, fontWeight, container).fitText(text);

        promise.resolve(fontSize);
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

        public TextFitter(
                String fontFamily,
                int fontWeight,
                Container container
        ) {
            this.fontFamily = fontFamily;
            this.fontWeight = fontWeight;
            this.container = container;
        }

        private float fitText(String text) {
            float low = 1;
            float high = container.height;
            float fontSize = low;
            String multilineText = "";
            while (low <= high) {
                float mid = (float) Math.floor((high + low) / 2);
                multilineText = join(wordWrap(text, container.width, mid), "\n");
                Container bounds = getTextBoundsMultiline(multilineText, mid);
                if (bounds.width <= container.width && bounds.height <= container.height) {
                    fontSize = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            Log.d("fitText", multilineText);
            return fontSize;
        }

        // Source: https://github.com/fogleman/gg/blob/master/wrap.go
        private List<String> wordWrap(String text, float width, float fontSize) {
            List<String> result = new ArrayList<>();
            for (String line : text.split("\n")) {
                List<String> fields = splitOnSpace(line);
                if (fields.size() % 2 == 1) {
                    fields.add("");
                }
                String x = "";
                for (int i = 0; i < fields.size(); i += 2) {
                    float w = getTextBoundsMultiline(x + fields.get(i), fontSize).width;
                    if (w > width) {
                        if (x.equals("")) {
                            result.add(fields.get(i));
                            x = "";
                            continue;
                        } else {
                            result.add(x);
                            x = "";
                        }
                    }
                    x += fields.get(i) + fields.get(i + 1);
                }
                if (!x.equals("")) {
                    result.add(x);
                }
            }
            for (int i = 0; i < result.size(); i++) {
                result.set(i, result.get(i).trim());
            }
            return result;
        }

        // Source: https://github.com/fogleman/gg/blob/master/wrap.go
        private List<String> splitOnSpace(String x) {
            List<String> result = new ArrayList<>();
            int pi = 0;
            boolean ps = false;
            for (int i = 0; i < x.length(); i++) {
                char c = x.charAt(i);
                boolean s = Character.isSpaceChar(c) && Character.isWhitespace(c);
                if (s != ps && i > 0) {
                    result.add(x.substring(pi, i));
                    pi = i;
                }
                ps = s;
            }
            result.add(x.substring(pi));
            return result;
        }

        private Container getTextBoundsMultiline(String text, float fontSize) {
            String[] lines = text.split("\n");
            float width = 0;
            float height = 0;
            for (String l : lines) {
                Rect bounds = getTextBounds(l, fontSize);
                if (bounds.width() > width) {
                    width = bounds.width();
                }
                height += bounds.height();
            }
            return new Container(width, height);
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

        private String join(List<String> lines, String delimiter) {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < lines.size(); i++) {
                result.append(i < (lines.size() - 1) ? lines.get(i) + delimiter : lines.get(i));
            }
            return result.toString();
        }
    }

    private class Container {
        public float width;
        public float height;

        public Container(float width, float height) {
            this.width = width;
            this.height = height;
        }
    }

}
