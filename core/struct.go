package core

type Canvas struct {
	Width      float64
	Height     float64
	Background string
	Debug      bool
	Elements   *CanvasElements
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
	Color           string
	Caps            bool
	OutlineWidth    float64
	OutlineColor    string
	BackgroundColor string
}

type Rect struct {
	X        float64
	Y        float64
	Width    float64
	Height   float64
	Rotation float64
}
