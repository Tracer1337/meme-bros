package core

import (
	"github.com/fogleman/gg"
)

type RenderingContext struct {
	Canvas *Canvas
}

func NewRenderingContext(c *Canvas) *RenderingContext {
	return &RenderingContext{
		Canvas: c,
	}
}

func (rc *RenderingContext) Render(index int) *gg.Context {
	l := rc.newLayer()

	for _, e := range rc.Canvas.Drawables {
		e.Draw(l, rc.Canvas, index)
	}

	return l
}

func (rc *RenderingContext) newLayer() *gg.Context {
	return gg.NewContext(int(rc.Canvas.Width), int(rc.Canvas.Height))
}
