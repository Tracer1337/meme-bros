package core

import (
	"github.com/fogleman/gg"
)

func (rect *Rect) Draw(dc *gg.Context) {
	dc.SetRGB(0, 1, 0)
	dc.SetLineWidth(2)
	dc.DrawRectangle(rect.X, rect.Y, rect.Width, rect.Height)
	dc.Stroke()
}

func (rect *Rect) ApplyRotation(dc *gg.Context) {
	x, y := rect.Center()
	dc.RotateAbout(rect.Rotation, x, y)
}

func (rect *Rect) ApplyScaling(dc *gg.Context, pWidth, pHeight float64) (sx, sy float64) {
	sx = rect.Width / float64(pWidth)
	sy = rect.Height / float64(pHeight)
	dc.Scale(sx, sy)
	return sx, sy
}

func (rect *Rect) Center() (x float64, y float64) {
	x = rect.X + rect.Width/2
	y = rect.Y + rect.Height/2
	return x, y
}
