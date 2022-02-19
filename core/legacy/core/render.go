package core

import (
	"meme-bros/core/modules"

	"github.com/Tracer1337/gg"
	"golang.org/x/image/draw"
)

type RenderingContext struct {
	Canvas  *Canvas
	Modules *modules.Modules
}

func NewRenderingContext(c *Canvas, m *modules.Modules) *RenderingContext {
	return &RenderingContext{
		Canvas:  c,
		Modules: m,
	}
}

func (rc *RenderingContext) Render(index int) *gg.Context {
	dc := rc.newLayer()

	dc.SetTransformer(draw.ApproxBiLinear)

	for _, e := range rc.Canvas.Drawables {
		e.Draw(rc, dc, index)
	}

	return dc
}

func (rc *RenderingContext) newLayer() *gg.Context {
	return gg.NewContext(int(rc.Canvas.Width), int(rc.Canvas.Height))
}
