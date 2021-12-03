package core

import "image/color"

type Canvas struct {
	Width           float64
	Height          float64
	BackgroundColor *color.RGBA
	Debug           bool
	Elements        *CanvasElements
}

type CanvasElements struct {
	Images    []*ImageElement
	Textboxes []*TextboxElement
}

type ImageElement struct {
	Id   int
	Rect *Rect
	Data *ImageData
}

type ImageData struct {
	URI          string
	BorderRadius float64
}

type TextboxElement struct {
	Id   int
	Rect *Rect
	Data *TextboxData
}

type TextboxData struct {
	Text            string
	FontFamily      string
	FontWeight      string
	TextAlign       string
	Color           *color.RGBA
	Caps            bool
	OutlineWidth    float64
	OutlineColor    *color.RGBA
	BackgroundColor *color.RGBA
}

type Rect struct {
	X        float64
	Y        float64
	Width    float64
	Height   float64
	Rotation float64
}
