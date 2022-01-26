package core

import (
	"image"

	"github.com/Tracer1337/gg"
)

func (e *AnimatedElement) GetIndex() int {
	return e.Index
}

func (e *AnimatedElement) GetType() string {
	return "animated"
}

func (e *AnimatedElement) Draw(dc *gg.Context, c *Canvas, i int) {
	e.deriveImageElement(i).Draw(dc, c, i)
}

func (e *AnimatedElement) deriveImageElement(i int) *ImageElement {
	var img image.Image
	if e.Data.Loop {
		img = e.Data.Disposed[i%len(e.Data.Disposed)]
	} else {
		if i < len(e.Data.Disposed) {
			img = e.Data.Disposed[i]
		} else {
			img = e.Data.Disposed[len(e.Data.Disposed)-1]
		}
	}
	return &ImageElement{
		Index: e.Index,
		Rect:  e.Rect,
		Data: &ImageData{
			Image:        img,
			BorderRadius: e.Data.BorderRadius,
		},
	}
}

func (e *AnimatedElement) renderDisposedImages() {
	e.Data.Disposed = make([]image.Image, len(e.Data.GIF.Image))
	dc := gg.NewContextForImage(e.Data.GIF.Image[0])
	for i, frame := range e.Data.GIF.Image {
		dc.DrawImage(frame, 0, 0)
		cloned := gg.NewContextForImage(dc.Image())
		cloned.DrawImage(dc.Image(), 0, 0)
		e.Data.Disposed[i] = cloned.Image()
	}
}
