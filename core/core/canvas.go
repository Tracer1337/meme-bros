package core

import (
	"bytes"
	"image"
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

func (c *Canvas) splitLayers() ([]Drawable, []Drawable) {
	e := c.Elements.Animations[0]

	bottomLayer := make([]Drawable, 0)
	topLayer := make([]Drawable, 0)

	for _, d := range c.Drawables {
		if d.GetIndex() < e.Index {
			bottomLayer = append(bottomLayer, d)
		} else {
			topLayer = append(topLayer, d)
		}
	}

	return bottomLayer, topLayer
}

func (c *Canvas) renderLayer(ds []Drawable) image.Image {
	newCanvas := *c
	newCanvas.Drawables = ds
	return NewRenderingContext(&newCanvas).Render().Image()
}

type Background struct{}

func (bg *Background) Draw(dc *gg.Context, c *Canvas) {
	dc.SetColor(c.BackgroundColor)
	dc.Clear()
}

func (bg *Background) GetIndex() int {
	return -1
}
