package core

import "github.com/Tracer1337/gg"

func (bg *BackgroundElement) GetIndex() int {
	return -1
}

func (bg *BackgroundElement) GetType() string {
	return "background"
}

func (bg *BackgroundElement) Draw(rc *RenderingContext, dc *gg.Context, i int) {
	dc.SetColor(rc.Canvas.BackgroundColor)
	dc.Clear()
}
