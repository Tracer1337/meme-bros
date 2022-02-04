package core

import (
	"image"
	"image/color"
	"image/gif"

	"github.com/Tracer1337/gg"
)

type Drawable interface {
	Draw(dc *gg.Context, c *Canvas, i int)
	GetIndex() int
	GetType() string
}

type Canvas struct {
	Width           float64
	Height          float64
	PixelRatio      float64
	BackgroundColor *color.RGBA
	Debug           bool
	Animated        bool
	MultiPalette    bool
	Elements        *CanvasElements
	Drawables       []Drawable
}

type CanvasElements struct {
	Background *BackgroundElement
	Images     []*ImageElement
	Animations []*AnimatedElement
	Textboxes  []*TextboxElement
	Shapes     []*ShapeElement
}

type BackgroundElement struct{}

type ImageElement struct {
	Index int
	Rect  *Rect
	Data  *ImageData
}

type ImageData struct {
	Image        image.Image
	BorderRadius float64
}

type AnimatedElement struct {
	Index int
	Rect  *Rect
	Data  *AnimationData
}

type AnimationData struct {
	GIF          *gif.GIF
	Disposed     []image.Image
	Loop         bool
	BorderRadius float64
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
	VerticalAlign   string
	Color           *color.RGBA
	Caps            bool
	OutlineWidth    float64
	OutlineColor    *color.RGBA
	BackgroundColor *color.RGBA
	Padding         float64
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
