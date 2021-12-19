package core

import (
	"image/color"
	"math"
	"meme-bros/core/utils"
	"sort"
	"strings"

	"github.com/valyala/fastjson"
)

func CanvasFromJSON(jsonString string) *Canvas {
	var p fastjson.Parser
	v, err := p.Parse(jsonString)
	utils.CatchError(err)
	return parseCanvas(v)
}

func parseRGBA(v []*fastjson.Value) *color.RGBA {
	if len(v) < 4 {
		return &color.RGBA{0, 0, 0, 0}
	}
	return &color.RGBA{
		uint8(v[0].GetInt()),
		uint8(v[1].GetInt()),
		uint8(v[2].GetInt()),
		uint8(v[3].GetInt()),
	}
}

func parseCanvas(v *fastjson.Value) *Canvas {
	elements := parseElements(v.GetArray("elements"))
	c := &Canvas{
		Width:           math.Max(v.GetFloat64("width"), 1),
		Height:          math.Max(v.GetFloat64("height"), 1),
		BackgroundColor: parseRGBA(v.GetArray("backgroundColor")),
		Debug:           v.GetBool("debug"),
		Elements: &CanvasElements{
			Images:     parseImages(elements["image"]),
			Animations: parseAnimations(elements["image"]),
			Textboxes:  parseTextboxes(elements["textbox"]),
			Shapes:     parseShapes(elements["shape"]),
		},
	}
	c.Drawables = collectDrawables(c)
	sortDrawables(c.Drawables)
	c.Animated = len(c.Elements.Animations) > 0
	return c
}

func collectDrawables(c *Canvas) []Drawable {
	ds := make([]Drawable, 0)
	ds = append(ds, &Background{})
	for _, e := range c.Elements.Images {
		ds = append(ds, e)
	}
	for _, e := range c.Elements.Animations {
		ds = append(ds, e)
	}
	for _, e := range c.Elements.Textboxes {
		ds = append(ds, e)
	}
	for _, e := range c.Elements.Shapes {
		ds = append(ds, e)
	}
	return ds
}

func sortDrawables(ds []Drawable) {
	sort.Slice(ds, func(i, j int) bool {
		return ds[i].GetIndex() < ds[j].GetIndex()
	})
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

func isAnimated(dataURI string) bool {
	return strings.HasPrefix(dataURI, "data:image/gif")
}

func parseImages(vs []*fastjson.Value) []*ImageElement {
	elements := []*ImageElement{}
	for _, e := range vs {
		imageURI := string(e.GetStringBytes("data", "uri"))
		if imageURI == "" || isAnimated(imageURI) {
			continue
		}
		newElement := &ImageElement{
			Index: e.GetInt("id"),
			Rect:  parseRect(e.Get("rect")),
			Data: &ImageData{
				Image:        utils.ParseBase64Image(imageURI),
				BorderRadius: e.GetFloat64("data", "borderRadius"),
			},
		}
		elements = append(elements, newElement)
	}
	return elements
}

func parseAnimations(vs []*fastjson.Value) []*AnimatedElement {
	elements := []*AnimatedElement{}
	for _, e := range vs {
		imageURI := string(e.GetStringBytes("data", "uri"))
		if imageURI == "" || !isAnimated(imageURI) {
			continue
		}
		newElement := &AnimatedElement{
			Index: e.GetInt("id"),
			Rect:  parseRect(e.Get("rect")),
			Data: &AnimationData{
				GIF:          utils.ParseBase64GIF(imageURI),
				Loop:         e.GetBool("data", "loop"),
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
			Index: e.GetInt("id"),
			Rect:  parseRect(e.Get("rect")),
			Data: &TextboxData{
				Text:            string(e.GetStringBytes("data", "text")),
				FontFamily:      stringWithDefault(e.GetStringBytes("data", "fontFamily"), "Impact"),
				FontWeight:      stringWithDefault(e.GetStringBytes("data", "fontWeight"), "normal"),
				TextAlign:       stringWithDefault(e.GetStringBytes("data", "textAlign"), "center"),
				VerticalAlign:   stringWithDefault(e.GetStringBytes("data", "verticalAlign"), "center"),
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

func parseShapes(vs []*fastjson.Value) []*ShapeElement {
	elements := []*ShapeElement{}
	for _, e := range vs {
		newElement := &ShapeElement{
			Index: e.GetInt("id"),
			Rect:  parseRect(e.Get("rect")),
			Data: &ShapeData{
				Variant:         stringWithDefault(e.GetStringBytes("data", "variant"), "rectangle"),
				BackgroundColor: parseRGBA(e.GetArray("data", "backgroundColor")),
				BorderColor:     parseRGBA(e.GetArray("data", "borderColor")),
				BorderWidth:     e.GetFloat64("data", "borderWidth"),
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
