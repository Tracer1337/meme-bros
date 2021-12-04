package core

import "github.com/fogleman/gg"

type ShapeDrawingContext struct {
	dc *gg.Context
	c  *Canvas
}

func (e *ShapeElement) Draw(dc *gg.Context, c *Canvas) {
	defer dc.Identity()

	e.Rect.ApplyRotation(dc)

	context := &ShapeDrawingContext{dc, c}

	switch e.Data.Variant {
	case "rect":
		e.drawRect(context)
	case "ellipse":
		e.drawEllipse(context)
	}

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *ShapeElement) drawRect(c *ShapeDrawingContext) {
	c.dc.DrawRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height)

	c.dc.SetColor(e.Data.BackgroundColor)
	c.dc.Fill()

	bw := e.Data.BorderWidth
	c.dc.SetColor(e.Data.BorderColor)
	c.dc.SetLineWidth(e.Data.BorderWidth)
	c.dc.DrawRectangle(e.Rect.X+bw/2, e.Rect.Y+bw/2, e.Rect.Width-bw, e.Rect.Height-bw)
	c.dc.Stroke()
}

func (e *ShapeElement) drawEllipse(c *ShapeDrawingContext) {
	cx, cy := e.Rect.Center()
	rx, ry := e.Rect.Width/2, e.Rect.Height/2

	c.dc.DrawEllipse(cx, cy, rx, ry)

	c.dc.SetColor(e.Data.BackgroundColor)
	c.dc.Fill()

	bw := e.Data.BorderWidth
	c.dc.SetColor(e.Data.BorderColor)
	c.dc.SetLineWidth(e.Data.BorderWidth)
	c.dc.DrawEllipse(cx, cy, rx-bw/2, ry-bw/2)
	c.dc.Stroke()
}
