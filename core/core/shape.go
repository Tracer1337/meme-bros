package core

import "github.com/Tracer1337/gg"

func (e *ShapeElement) GetIndex() int {
	return e.Index
}

func (e *ShapeElement) GetType() string {
	return "shape"
}

func (e *ShapeElement) Draw(dc *gg.Context, c *Canvas, i int) {
	defer dc.Identity()

	e.Rect.ApplyRotation(dc)

	switch e.Data.Variant {
	case "rect":
		e.drawRect(dc, c)
	case "ellipse":
		e.drawEllipse(dc, c)
	}

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *ShapeElement) drawRect(dc *gg.Context, c *Canvas) {
	dc.DrawRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height)

	dc.SetColor(e.Data.BackgroundColor)
	dc.Fill()

	bw := e.Data.BorderWidth
	dc.SetColor(e.Data.BorderColor)
	dc.SetLineWidth(e.Data.BorderWidth)
	dc.DrawRectangle(e.Rect.X+bw/2, e.Rect.Y+bw/2, e.Rect.Width-bw, e.Rect.Height-bw)
	dc.Stroke()
}

func (e *ShapeElement) drawEllipse(dc *gg.Context, c *Canvas) {
	cx, cy := e.Rect.Center()
	rx, ry := e.Rect.Width/2, e.Rect.Height/2

	dc.DrawEllipse(cx, cy, rx, ry)

	dc.SetColor(e.Data.BackgroundColor)
	dc.Fill()

	bw := e.Data.BorderWidth
	dc.SetColor(e.Data.BorderColor)
	dc.SetLineWidth(e.Data.BorderWidth)
	dc.DrawEllipse(cx, cy, rx-bw/2, ry-bw/2)
	dc.Stroke()
}
