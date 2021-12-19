# Core

meme-bros/core generates memes from json files.

## JSON Schema

```ts
Schema = {
    "width": Number,
    "height": Number,
    "debug": Boolean,
    "backgroundColor": Color,
    "elements": Elements[]
}
```

## Color

```ts
Color = [Number, Number, Number, Number] // (R, G, B, A)
```

## Elements

### Common

```ts
Common = {
    "id": Number,
    "type": String,
    "rect": {
        "x": Number,
        "y": Number,
        "width": Number,
        "height": Number,
        "rotation": Number
    },
    "data": Object
}
```

### Image

```ts
Image = {
    ...Common,
    "type": "image",
    "data": {
        "uri": String,
        "borderRadius": Number,
        "loop": Boolean
    }
}
```

### Textbox

```ts
Textbox = {
    ...Common,
    "type": "textbox",
    "data": {
        "text": String,
        "fontFamily": "Arial" | "Comic-Sans" | "Impact",
        "fontWeight": "normal" | "bold",
        "textAlign": "left" | "center" | "right",
        "verticalAlign": "top" | "center" | "bottom",
        "color": Color,
        "caps": Boolean,
        "outlineWidth": Number,
        "outlineColor": Color,
        "backgroundColor": Color
    }
}
```

### Shape

```ts
Shape = {
    ...Common,
    "type": "shape",
    "data": {
        "variant": "rect" | "ellipse",
        "backgroundColor": Color,
        "borderColor": Color,
        "borderWidth": Number
    }
}
```
