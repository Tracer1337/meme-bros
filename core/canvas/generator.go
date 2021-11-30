package canvas

import (
	"bytes"
	"meme-bros/core/utils"
	"strings"

	"github.com/fogleman/gg"
)

func (c *Canvas) Generate() *bytes.Buffer {
	img := utils.ParseBase64Image(c.Image.URI)
	dc := gg.NewContext(c.Image.Width, c.Image.Height)
	dc.DrawImage(img, 0, 0)
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
	fontSize := fitText(e.Data.Text, e.Data.FontFamily, e.Rect.Width, e.Rect.Height)
	loadFont(dc, e.Data.FontFamily, fontSize)
	dc.SetHexColor(e.Data.Color)
	text := e.Data.Text
	if e.Data.Caps {
		text = strings.ToUpper(text)
	}
	dc.DrawStringWrapped(text, e.Rect.X, e.Rect.Y, 0, 0, e.Rect.Width, LINE_SPACING, gg.AlignLeft)
}
