package core

import (
	"fmt"
	"time"

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

	for i, e := range rc.Layers {
		go func(i int, e Drawable) {
			t0 := time.Now()
			l := rc.newLayer()
			e.Draw(l, rc.Canvas)
			rc.Rendered[i] = l
			fmt.Printf("Rendered %v in %s\n", i, time.Since(t0))
			done <- 0
		}(i, e)
	}

	for i := 0; i < rc.NLayers; i++ {
		<-done

		for j := 0; j < rc.NLayers; j++ {
			if rc.Rendered[j] == nil {
				continue
			}
			k := rc.findNextLayer(j)
			if k == -1 {
				continue
			}
			t0 := time.Now()
			rc.mergeLayers(j, k)
			fmt.Printf("Merged %v -> %v in %s\n", k, j, time.Since(t0))
		}
	}

	return rc.Rendered[0]
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

func (rc *RenderingContext) mergeLayers(i0 int, i1 int) *gg.Context {
	l2 := rc.newLayer()
	l2.DrawImage(rc.Rendered[i0].Image(), 0, 0)
	l2.DrawImage(rc.Rendered[i1].Image(), 0, 0)
	rc.Merged[i1] = true
	rc.Rendered[i1] = nil
	rc.Rendered[i0] = l2
	return l2
}

func (rc *RenderingContext) newLayer() *gg.Context {
	return gg.NewContext(int(rc.Canvas.Width), int(rc.Canvas.Height))
}
