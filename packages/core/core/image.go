package core

import (
	"github.com/Tracer1337/gg"
)

func (e *ImageElement) GetIndex() int {
	return e.Index
}

func (e *ImageElement) GetType() string {
	return "image"
}

func (e *ImageElement) Draw(dc *gg.Context, c *Canvas, i int) {
	defer dc.Identity()
	defer dc.ResetClip()

	e.Rect.ApplyRotation(dc)
	e.drawBorderRadius(dc, c)
	e.drawImage(dc, c)

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *ImageElement) drawBorderRadius(dc *gg.Context, c *Canvas) {
	dc.DrawRoundedRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height, e.Data.BorderRadius)
	dc.Clip()
}

func (e *ImageElement) drawImage(dc *gg.Context, c *Canvas) {
	bounds := e.Data.Image.Bounds()
	sx, sy := e.Rect.ApplyScaling(dc, float64(bounds.Max.X), float64(bounds.Max.Y))
	dc.DrawImage(e.Data.Image, int(e.Rect.X*(1/sx)), int(e.Rect.Y*(1/sy)))
	dc.Scale(1/sx, 1/sy)
}
