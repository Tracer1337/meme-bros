package core

import (
	"bytes"

	"github.com/fogleman/gg"
)

type Drawable interface {
	Draw(dc *gg.Context, c *Canvas)
}

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
	elements := c.collectElements()

	for _, e := range elements {
		e.Draw(dc, c)
	}
}

func (c *Canvas) collectElements() []Drawable {
	elements := make([]Drawable, 0)

	for _, e := range c.Elements.Images {
		elements = append(elements, e)
	}
	for _, e := range c.Elements.Textboxes {
		elements = append(elements, e)
	}
	for _, e := range c.Elements.Shapes {
		elements = append(elements, e)
	}

	return elements
}
