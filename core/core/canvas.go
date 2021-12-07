package core

import (
	"bytes"

	"github.com/fogleman/gg"
)

func (c *Canvas) Generate() *bytes.Buffer {
	c.prependLayer(&Background{})

	rc := NewRenderingContext(c)

	result := rc.Render()
	buffer := bytes.NewBuffer([]byte{})
	result.EncodePNG(buffer)

	return buffer
}

func (c *Canvas) prependLayer(l Drawable) {
	newDrawables := make([]Drawable, 1)
	newDrawables[0] = l
	newDrawables = append(newDrawables, c.Drawables...)
	c.Drawables = newDrawables
}

type Background struct{}

func (bg *Background) Draw(dc *gg.Context, c *Canvas) {
	dc.SetColor(c.BackgroundColor)
	dc.Clear()
}
