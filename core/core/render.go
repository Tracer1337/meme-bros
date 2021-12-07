package core

import (
	"github.com/fogleman/gg"
)

type RenderingContext struct {
	Canvas   *Canvas
	NLayers  int
	Layers   []Drawable
	Rendered []*gg.Context
	Merged   []bool
}

func NewRenderingContext(c *Canvas) *RenderingContext {
	n := len(c.Drawables)
	return &RenderingContext{
		Canvas:   c,
		NLayers:  n,
		Layers:   c.Drawables,
		Rendered: make([]*gg.Context, n),
		Merged:   make([]bool, n),
	}
}

func (rc *RenderingContext) Render() *gg.Context {
	done := make(chan int)

	rc.drawLayers(done)
	rc.mergeLoop(done)

	return rc.Rendered[0]
}

func (rc *RenderingContext) drawLayers(done chan int) {
	for i, e := range rc.Layers {
		go func(i int, e Drawable) {
			l := rc.newLayer()
			e.Draw(l, rc.Canvas)
			rc.Rendered[i] = l
			done <- 0
		}(i, e)
	}
}

func (rc *RenderingContext) mergeLoop(done chan int) {
	for range rc.Layers {
		<-done
		rc.mergeLayers()
	}

	for rc.hasUnmergedLayers() {
		rc.mergeLayers()
	}
}

func (rc *RenderingContext) mergeLayers() {
	for j := 0; j < rc.NLayers; j++ {
		if rc.Rendered[j] == nil {
			continue
		}

		k := rc.findNextLayer(j)
		if k == -1 {
			continue
		}

		rc.Rendered[j].DrawImage(rc.Rendered[k].Image(), 0, 0)
		rc.Merged[k] = true
		rc.Rendered[k] = nil
	}
}

func (rc *RenderingContext) findNextLayer(i int) int {
	for j := i + 1; j < rc.NLayers; j++ {
		if rc.Rendered[j] == nil && !rc.Merged[j] {
			return -1
		}
		if rc.Rendered[j] != nil {
			return j
		}
	}
	return -1
}

func (rc *RenderingContext) hasUnmergedLayers() bool {
	if len(rc.Merged) <= 1 {
		return false
	}
	for i := 1; i < len(rc.Merged); i++ {
		if !rc.Merged[i] {
			return true
		}
	}
	return false
}

func (rc *RenderingContext) newLayer() *gg.Context {
	return gg.NewContext(int(rc.Canvas.Width), int(rc.Canvas.Height))
}
