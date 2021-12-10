package core

import (
	"image/color"

	"github.com/fogleman/gg"
)

type Drawable interface {
	Draw(dc *gg.Context, c *Canvas)
	GetIndex() int
}

type Canvas struct {
	Width           float64
	Height          float64
	BackgroundColor *color.RGBA
	Debug           bool
	Animated        bool
	Elements        *CanvasElements
	Drawables       []Drawable
}

type CanvasElements struct {
	Images     []*ImageElement
	Animations []*AnimatedElement
	Textboxes  []*TextboxElement
	Shapes     []*ShapeElement
}

type ImageElement struct {
	Index int
	Rect  *Rect
	Data  *ImageData
}

type ImageData struct {
	URI          string
	BorderRadius float64
}

type AnimatedElement struct {
	Index int
	Rect  *Rect
	Data  *AnimationData
}

type AnimationData struct {
	URI string
}

type TextboxElement struct {
	Index int
	Rect  *Rect
	Data  *TextboxData
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

type ShapeElement struct {
	Index int
	Rect  *Rect
	Data  *ShapeData
}

type ShapeData struct {
	Variant         string
	BackgroundColor *color.RGBA
	BorderColor     *color.RGBA
	BorderWidth     float64
}

type Rect struct {
	X        float64
	Y        float64
	Width    float64
	Height   float64
	Rotation float64
}
