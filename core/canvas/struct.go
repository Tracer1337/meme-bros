package canvas

type Canvas struct {
	Image    *CanvasImage
	Elements *CanvasElements
}

type CanvasImage struct {
	URI    string
	Width  int
	Height int
}

type CanvasElements struct {
	Textboxes []*TextboxElement
}

type TextboxElement struct {
	Id   int16
	Type string
	Rect *Rect
	Data *TextboxData
}

type TextboxData struct {
	Text       string
	FontFamily string
	Color      string
	Caps       bool
}

type Rect struct {
	X        float64
	Y        float64
	Width    float64
	Height   float64
	Rotation float64
}
