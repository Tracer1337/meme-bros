package core

import "github.com/fogleman/gg"

type Background struct{}

func (bg *Background) GetIndex() int {
	return -1
}

func (bg *Background) GetType() string {
	return "background"
}

func (bg *Background) Draw(dc *gg.Context, c *Canvas, i int) {
	dc.SetColor(c.BackgroundColor)
	dc.Clear()
}
