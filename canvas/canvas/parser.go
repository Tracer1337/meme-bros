package canvas

import (
	"fmt"

	"github.com/valyala/fastjson"
)

func parseCanvas(v *fastjson.Value) *Canvas {
	canvas := &Canvas{
		Image: CanvasImage{
			URI:    string(v.GetStringBytes("image", "uri")),
			Width:  v.GetFloat64("image", "width"),
			Height: v.GetFloat64("image", "height"),
		},
		Elements: []*CanvasElement{},
	}

	for _, e := range v.GetArray("elements") {
		canvas.Elements = append(canvas.Elements, parseElement(e))
	}

	return canvas
}

func parseElement(v *fastjson.Value) *CanvasElement {
	eType := string(v.GetStringBytes("type"))
	switch eType {
	case "textbox":
		return &CanvasElement{
			Type: "textbox",
			Rect: parseRect(v.Get("rect")),
			Data: parseTextboxData(v.Get("data")),
		}
	default:
		panic(fmt.Sprintf("Unknown element type '%s'", eType))
	}
}

func parseTextboxData(v *fastjson.Value) *TextboxData {
	return &TextboxData{
		Text:       string(v.GetStringBytes("text")),
		FontFamily: string(v.GetStringBytes("fontFamily")),
		Color:      string(v.GetStringBytes("color")),
		Caps:       v.GetBool("caps"),
	}
}

func parseRect(v *fastjson.Value) *Rect {
	return &Rect{
		X:      v.GetFloat64("x"),
		Y:      v.GetFloat64("y"),
		Width:  v.GetFloat64("width"),
		Height: v.GetFloat64("height"),
	}
}
