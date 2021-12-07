package core

import (
	"bytes"
	"fmt"
	"time"

	"github.com/fogleman/gg"
)

type Drawable interface {
	Draw(dc *gg.Context, c *Canvas)
}

func (c *Canvas) Generate() *bytes.Buffer {
	dc := c.newLayer()
	dc.SetColor(c.BackgroundColor)
	dc.Clear()
	c.drawElements(dc)
	buffer := bytes.NewBuffer([]byte{})
	dc.EncodePNG(buffer)
	return buffer
}

func (c *Canvas) newLayer() *gg.Context {
	return gg.NewContext(int(c.Width), int(c.Height))
}

func (c *Canvas) drawElements(dc *gg.Context) {
	elements := c.collectElements()
	n := len(elements)

	done := make(chan int)

	layers := make([]*gg.Context, n)

	for i, e := range elements {
		go func(i int, e Drawable) {
			t0 := time.Now()
			l := c.newLayer()
			e.Draw(l, c)
			layers[i] = l
			fmt.Printf("Rendered %v in %s\n", i, time.Since(t0))
			done <- 0
		}(i, e)
	}

	rendered := make([]bool, n)

	findNextLayer := func(i int) int {
		for j := i + 1; j < n; j++ {
			if layers[j] == nil && !rendered[j] {
				return -1
			}
			if layers[j] != nil {
				return j
			}
		}
		return -1
	}

	mergeLayers := func(i0 int, i1 int) *gg.Context {
		l2 := c.newLayer()
		l2.DrawImage(layers[i0].Image(), 0, 0)
		l2.DrawImage(layers[i1].Image(), 0, 0)
		rendered[i1] = true
		layers[i1] = nil
		layers[i0] = l2
		return l2
	}

	for i := 0; i < n; i++ {
		<-done

		for j := 0; j < n; j++ {
			if layers[j] == nil {
				continue
			}
			k := findNextLayer(j)
			if k == -1 {
				continue
			}
			t0 := time.Now()
			mergeLayers(j, k)
			fmt.Printf("Merged %v -> %v in %s\n", k, j, time.Since(t0))
		}
	}

	dc.DrawImage(layers[0].Image(), 0, 0)
}

func (c *Canvas) collectElements() []Drawable {
	elements := make([]Drawable, 0)

	for _, e := range c.Elements.Images {
		elements = append(elements, e)
	}
	for _, e := range c.Elements.Textboxes {
		elements = append(elements, e)
	}
	for _, e := range c.Elements.Shapes {
		elements = append(elements, e)
	}

	return elements
}
