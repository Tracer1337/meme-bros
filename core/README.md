# Core

meme-bros/core generates memes from json files.

## JSON Schema

```ts
{
    "width": Number,
    "height": Number,
    "debug": Boolean,
    "elements": Elements[]
}
```

## Elements

### Common

```ts
{
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
{
    ...Common,
    "type": "image",
    "data": {
        "uri": String,
        "borderRadius": Number
    }
}
```

### Textbox

```ts
{
    ...Common,
    "type": "textbox",
    "data": {
        "text": String,
        "fontFamily": "Arial" | "Comic-Sans" | "Impact",
        "fontWeight": "normal" | "bold",
        "textAlign": "left" | "center" | "right",
        "color": String,
        "caps": Boolean
    }
}
```
