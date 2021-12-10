package core

import (
	"image"
	"meme-bros/core/utils"

	"github.com/fogleman/gg"
)

type ImageDrawingContext struct {
	dc  *gg.Context
	c   *Canvas
	Img image.Image
}

func (e *ImageElement) GetIndex() int {
	return e.Index
}

func (e *ImageElement) Draw(dc *gg.Context, c *Canvas) {
	defer dc.Identity()
	defer dc.ResetClip()

	context := &ImageDrawingContext{
		dc:  dc,
		c:   c,
		Img: utils.ParseBase64Image(e.Data.URI),
	}

	e.Rect.ApplyRotation(dc)
	e.drawBorderRadius(context)
	e.drawImage(context)

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *ImageElement) drawBorderRadius(c *ImageDrawingContext) {
	c.dc.DrawRoundedRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height, e.Data.BorderRadius)
	c.dc.Clip()
}

func (e *ImageElement) drawImage(c *ImageDrawingContext) {
	bounds := c.Img.Bounds()
	sx, sy := e.Rect.ApplyScaling(c.dc, float64(bounds.Max.X), float64(bounds.Max.Y))
	c.dc.DrawImage(c.Img, int(e.Rect.X*(1/sx)), int(e.Rect.Y*(1/sy)))
	c.dc.Scale(1/sx, 1/sy)
}
