package canvas

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"strings"

	"github.com/fogleman/gg"
)

type Canvas struct {
	Image    CanvasImage     `json:"image"`
	Elements []CanvasElement `json:"elements"`
}

type CanvasImage struct {
	URI    string `json:"uri"`
	Width  string `json:"width"`
	Height string `json:"height"`
}

type CanvasElement struct {
	Id   int16       `json:"id"`
	Type string      `json:"type"`
	Rect Rect        `json:"rect"`
	Data TextboxData `json:"data"`
}

type Rect struct {
	X        float64 `json:"x"`
	Y        float64 `json:"y"`
	Width    float64 `json:"width"`
	Height   float64 `json:"height"`
	Rotation float64 `json:"rotation"`
}

type TextboxData struct {
	Text       string `json:"text"`
	FontFamily string `json:"fontFamily"`
	Color      string `json:"color"`
	Caps       bool   `json:"caps"`
}

const LINE_SPACING = 1.2

func (c *Canvas) Generate() *bytes.Buffer {
	dataURI := strings.Replace(c.Image.URI, "data:image/png;base64,", "", 1)
	reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(dataURI))
	image, _, err := image.Decode(reader)
	if err != nil {
		panic(err)
	}
	dc := gg.NewContextForImage(image)
	c.DrawElements(dc)
	buffer := bytes.NewBuffer([]byte{})
	dc.EncodePNG(buffer)
	return buffer
}

func (c *Canvas) DrawElements(dc *gg.Context) {
	for _, e := range c.Elements {
		if e.Type == "textbox" {
			c.DrawTextbox(dc, e)
		}
	}
}

func (c *Canvas) DrawTextbox(dc *gg.Context, e CanvasElement) {
	LoadFont(dc, e.Data.FontFamily)
	dc.SetHexColor(e.Data.Color)
	rect := ScaleRect(dc, e.Rect)
	text := e.Data.Text
	if e.Data.Caps {
		text = strings.ToUpper(text)
	}
	dc.DrawStringWrapped(text, rect.X, rect.Y, 0, 0, rect.Width, LINE_SPACING, gg.AlignLeft)
}

func ScaleRect(dc *gg.Context, rect Rect) Rect {
	return Rect{
		X:        rect.X * float64(dc.Width()),
		Y:        rect.X * float64(dc.Height()),
		Width:    rect.X * float64(dc.Width()),
		Height:   rect.X * float64(dc.Height()),
		Rotation: rect.Rotation,
	}
}

func LoadFont(dc *gg.Context, font string) {
	path := fmt.Sprintf("Library/Fonts/%s.ttf", font)
	if err := dc.LoadFontFace(path, 32); err != nil {
		panic(err)
	}
}

// func GetFontSize(dc *gg.Context, e CanvasElement) int16 {
// 	wrapped := dc.WordWrap(e.Data.Text, e.Rect.Width)
// 	width, height := dc.MeasureMultilineString(wrapped, LINE_SPACING)
// }
