package core

import (
	"bytes"
	"image/gif"

	"github.com/fogleman/gg"
)

func (c *Canvas) Render() *bytes.Buffer {
	c.prependLayer(&Background{})

	buffer := bytes.NewBuffer([]byte{})

	if c.Animated {
		gif.EncodeAll(buffer, NewAnimatedRenderingContext(c).Render())
	} else {
		NewRenderingContext(c).Render().EncodePNG(buffer)
	}

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

func (bg *Background) GetIndex() int {
	return -1
}
