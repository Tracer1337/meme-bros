package canvas

import (
	"github.com/valyala/fastjson"
)

func CanvasFromJSON(jsonString string) *Canvas {
	var p fastjson.Parser
	v, err := p.Parse(jsonString)
	if err != nil {
		panic(err)
	}
	return parseCanvas(v)
}

func parseCanvas(v *fastjson.Value) *Canvas {
	elements := parseElements(v.GetArray("elements"))
	return &Canvas{
		Image: &CanvasImage{
			URI:    string(v.GetStringBytes("image", "uri")),
			Width:  v.GetInt("image", "width"),
			Height: v.GetInt("image", "height"),
		},
		Elements: &CanvasElements{
			Textboxes: parseTextboxes(elements["textbox"]),
		},
	}
}

func parseElements(vs []*fastjson.Value) map[string][]*fastjson.Value {
	elemMap := map[string][]*fastjson.Value{}
	for _, e := range vs {
		eType := string(e.GetStringBytes("type"))
		if _, ok := elemMap[eType]; !ok {
			elemMap[eType] = []*fastjson.Value{}
		}
		elemMap[eType] = append(elemMap[eType], e)
	}
	return elemMap
}

func parseTextboxes(vs []*fastjson.Value) []*TextboxElement {
	elements := []*TextboxElement{}
	for _, e := range vs {
		newElement := &TextboxElement{
			Type: "textbox",
			Rect: parseRect(e.Get("rect")),
			Data: &TextboxData{
				Text:       string(e.GetStringBytes("data", "text")),
				FontFamily: string(e.GetStringBytes("data", "fontFamily")),
				TextAlign:  string(e.GetStringBytes("data", "textAlign")),
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
		X:        v.GetFloat64("x"),
		Y:        v.GetFloat64("y"),
		Width:    v.GetFloat64("width"),
		Height:   v.GetFloat64("height"),
		Rotation: v.GetFloat64("rotation"),
	}
}
