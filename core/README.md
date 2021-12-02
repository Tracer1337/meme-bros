# Core

meme-bros/core generates memes from json files.

## JSON Schema

```ts
{
    "width": Number,
    "height": Number,
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
        "fontFamily": String,
        "textAlign": String,
        "color": String,
        "caps": Boolean
    }
}
```
