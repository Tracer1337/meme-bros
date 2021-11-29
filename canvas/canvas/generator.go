package canvas

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"meme-bros/utils"
	"strings"

	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/mobile/asset"
)

const LINE_SPACING = 1.2

func (c *Canvas) Generate() *bytes.Buffer {
	img := utils.ParseBase64Image(c.Image.URI)
	dc := gg.NewContextForImage(img)
	c.DrawElements(dc)
	buffer := bytes.NewBuffer([]byte{})
	dc.EncodePNG(buffer)
	return buffer
}

func (c *Canvas) DrawElements(dc *gg.Context) {
	for _, e := range c.Elements.Textboxes {
		c.DrawTextbox(dc, e)
	}
}

func (c *Canvas) DrawTextbox(dc *gg.Context, e *TextboxElement) {
	LoadFont(dc, e.Data.FontFamily)
	dc.SetHexColor(e.Data.Color)
	rect := ScaleRect(dc, e.Rect)
	text := e.Data.Text
	if e.Data.Caps {
		text = strings.ToUpper(text)
	}
	dc.DrawStringWrapped(text, rect.X, rect.Y, 0, 0, rect.Width, LINE_SPACING, gg.AlignLeft)
}

func ScaleRect(dc *gg.Context, rect *Rect) Rect {
	return Rect{
		X:        rect.X * float64(dc.Width()),
		Y:        rect.Y * float64(dc.Height()),
		Width:    rect.X * float64(dc.Width()),
		Height:   rect.Y * float64(dc.Height()),
		Rotation: rect.Rotation,
	}
}

func LoadFont(dc *gg.Context, name string) {
	file, err := asset.Open(fmt.Sprintf("fonts/%s.ttf", name))
	if err != nil {
		panic(err)
	}
	defer file.Close()
	raw, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	font, err := truetype.Parse(raw)
	if err != nil {
		panic(err)
	}
	face := truetype.NewFace(font, &truetype.Options{
		Size: 32,
	})
	dc.SetFontFace(face)
}

// func GetFontSize(dc *gg.Context, e CanvasElement) int16 {
// 	wrapped := dc.WordWrap(e.Data.Text, e.Rect.Width)
// 	width, height := dc.MeasureMultilineString(wrapped, LINE_SPACING)
// }
