package canvas

import (
	"github.com/valyala/fastjson"
)

func canvasFromJSON(jsonString string) *Canvas {
	var p fastjson.Parser
	v, err := p.Parse(jsonString)
	if err != nil {
		panic(err)
	}
	return parseCanvas(v)
}

func parseCanvas(v *fastjson.Value) *Canvas {
	return &Canvas{
		Image: &CanvasImage{
			URI:    string(v.GetStringBytes("image", "uri")),
			Width:  v.GetFloat64("image", "width"),
			Height: v.GetFloat64("image", "height"),
		},
		Elements: &CanvasElements{
			Textboxes: parseTextboxes(v.GetArray("elements")),
		},
	}
}

func parseTextboxes(vs []*fastjson.Value) []*TextboxElement {
	elements := []*TextboxElement{}
	for _, e := range vs {
		if string(e.GetStringBytes("type")) != "textbox" {
			continue
		}
		newElement := &TextboxElement{
			Type: "textbox",
			Rect: parseRect(e.Get("rect")),
			Data: &TextboxData{
				Text:       string(e.GetStringBytes("data", "text")),
				FontFamily: string(e.GetStringBytes("data", "fontFamily")),
				Color:      string(e.GetStringBytes("data", "color")),
				Caps:       e.GetBool("data", "caps"),
			},
		}
		elements = append(elements, newElement)
	}
	return elements
}

func parseRect(v *fastjson.Value) *Rect {
	return &Rect{
		X:      v.GetFloat64("x"),
		Y:      v.GetFloat64("y"),
		Width:  v.GetFloat64("width"),
		Height: v.GetFloat64("height"),
	}
}
