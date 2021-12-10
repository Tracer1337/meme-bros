package core

import (
	"image"

	"github.com/fogleman/gg"
)

func (e *AnimatedElement) GetIndex() int {
	return e.Index
}

func (e *AnimatedElement) Draw(dc *gg.Context, c *Canvas, i int) {
	e.deriveImageElement(i).Draw(dc, c, i)
}

func (e *AnimatedElement) deriveImageElement(i int) *ImageElement {
	return &ImageElement{
		Index: e.Index,
		Rect:  e.Rect,
		Data: &ImageData{
			Image:        e.Data.Disposed[i%len(e.Data.Disposed)],
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
