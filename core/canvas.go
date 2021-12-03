package core

import (
	"bytes"

	"github.com/fogleman/gg"
)

func (c *Canvas) Generate() *bytes.Buffer {
	dc := gg.NewContext(int(c.Width), int(c.Height))
	dc.SetColor(c.BackgroundColor)
	dc.Clear()
	c.drawElements(dc)
	buffer := bytes.NewBuffer([]byte{})
	dc.EncodePNG(buffer)
	return buffer
}

func (c *Canvas) drawElements(dc *gg.Context) {
	for _, e := range c.Elements.Images {
		e.Draw(dc, c)
	}

	for _, e := range c.Elements.Textboxes {
		e.Draw(dc, c)
	}

	for _, e := range c.Elements.Shapes {
		e.Draw(dc, c)
	}
}
