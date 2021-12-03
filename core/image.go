package core

import (
	"image"
	"meme-bros/core/utils"

	"github.com/fogleman/gg"
)

type ImageDrawingContext struct {
	dc     *gg.Context
	c      *Canvas
	Img    image.Image
	SX, SY float64
}

func (e *ImageElement) Draw(dc *gg.Context, c *Canvas) {
	defer dc.Identity()
	defer dc.ResetClip()

	context := &ImageDrawingContext{
		dc:  dc,
		c:   c,
		Img: utils.ParseBase64Image(e.Data.URI),
	}

	e.applyTransform(context)
	e.drawBorderRadius(context)
	e.drawImage(context)

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *ImageElement) applyTransform(c *ImageDrawingContext) {
	e.Rect.ApplyRotation(c.dc)
	bounds := c.Img.Bounds()
	sx, sy := e.Rect.ApplyScaling(c.dc, float64(bounds.Max.X), float64(bounds.Max.Y))
	c.SX = sx
	c.SY = sy
}

func (e *ImageElement) drawBorderRadius(c *ImageDrawingContext) {
	c.dc.DrawRoundedRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height, e.Data.BorderRadius)
	c.dc.Clip()
}

func (e *ImageElement) drawImage(c *ImageDrawingContext) {
	c.dc.DrawImage(c.Img, int(e.Rect.X*(1/c.SX)), int(e.Rect.Y*(1/c.SY)))
}
