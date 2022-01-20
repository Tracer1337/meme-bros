package core

import "github.com/Tracer1337/gg"

func (bg *BackgroundElement) GetIndex() int {
	return -1
}

func (bg *BackgroundElement) GetType() string {
	return "background"
}

func (bg *BackgroundElement) Draw(dc *gg.Context, c *Canvas, i int) {
	dc.SetColor(c.BackgroundColor)
	dc.Clear()
}
