package core

import (
	"image/color"

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

func parseRGBA(v []*fastjson.Value) *color.RGBA {
	return &color.RGBA{
		uint8(v[0].GetInt()),
		uint8(v[1].GetInt()),
		uint8(v[2].GetInt()),
		uint8(v[3].GetInt()),
	}
}

func parseCanvas(v *fastjson.Value) *Canvas {
	elements := parseElements(v.GetArray("elements"))
	return &Canvas{
		Width:           v.GetFloat64("width"),
		Height:          v.GetFloat64("height"),
		BackgroundColor: parseRGBA(v.GetArray("backgroundColor")),
		Debug:           v.GetBool("debug"),
		Elements: &CanvasElements{
			Images:    parseImages(elements["image"]),
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

func parseImages(vs []*fastjson.Value) []*ImageElement {
	elements := []*ImageElement{}
	for _, e := range vs {
		newElement := &ImageElement{
			Id:   e.GetInt("id"),
			Rect: parseRect(e.Get("rect")),
			Data: &ImageData{
				URI:          string(e.GetStringBytes("data", "uri")),
				BorderRadius: e.GetFloat64("data", "borderRadius"),
			},
		}
		elements = append(elements, newElement)
	}
	return elements
}

func parseTextboxes(vs []*fastjson.Value) []*TextboxElement {
	elements := []*TextboxElement{}
	for _, e := range vs {
		newElement := &TextboxElement{
			Id:   e.GetInt("id"),
			Rect: parseRect(e.Get("rect")),
			Data: &TextboxData{
				Text:            string(e.GetStringBytes("data", "text")),
				FontFamily:      string(e.GetStringBytes("data", "fontFamily")),
				FontWeight:      string(e.GetStringBytes("data", "fontWeight")),
				TextAlign:       string(e.GetStringBytes("data", "textAlign")),
				Color:           parseRGBA(e.GetArray("data", "color")),
				Caps:            e.GetBool("data", "caps"),
				OutlineWidth:    e.GetFloat64("data", "outlineWidth"),
				OutlineColor:    parseRGBA(e.GetArray("data", "outlineColor")),
				BackgroundColor: parseRGBA(e.GetArray("data", "backgroundColor")),
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
