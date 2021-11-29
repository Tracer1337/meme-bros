package canvas

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"meme-bros/core/utils"
	"strings"

	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/mobile/asset"
)

const LINE_SPACING = 1.2

func (c *Canvas) Generate() *bytes.Buffer {
	img := utils.ParseBase64Image(c.Image)
	dc := gg.NewContextForImage(img)
	c.drawElements(dc)
	buffer := bytes.NewBuffer([]byte{})
	dc.EncodePNG(buffer)
	return buffer
}

func (c *Canvas) drawElements(dc *gg.Context) {
	for _, e := range c.Elements.Textboxes {
		c.drawTextbox(dc, e)
	}
}

func (c *Canvas) drawTextbox(dc *gg.Context, e *TextboxElement) {
	loadFont(dc, e.Data.FontFamily)
	dc.SetHexColor(e.Data.Color)
	rect := scaleRect(dc, e.Rect)
	text := e.Data.Text
	if e.Data.Caps {
		text = strings.ToUpper(text)
	}
	dc.DrawStringWrapped(text, rect.X, rect.Y, 0, 0, rect.Width, LINE_SPACING, gg.AlignLeft)
}

func scaleRect(dc *gg.Context, rect *Rect) Rect {
	return Rect{
		X:        rect.X * float64(dc.Width()),
		Y:        rect.Y * float64(dc.Height()),
		Width:    rect.X * float64(dc.Width()),
		Height:   rect.Y * float64(dc.Height()),
		Rotation: rect.Rotation,
	}
}

func loadFont(dc *gg.Context, name string) {
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
