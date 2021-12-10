package core

import (
	"image"
	"image/gif"
	"meme-bros/core/utils"
	"sync"

	"github.com/fogleman/gg"
)

type AnimatedRenderingContext struct {
	Canvas           *Canvas
	RenderingContext *RenderingContext
}

func NewAnimatedRenderingContext(c *Canvas) *AnimatedRenderingContext {
	return &AnimatedRenderingContext{
		Canvas: c,
	}
}

func (rc *AnimatedRenderingContext) Render() *gif.GIF {
	var wg sync.WaitGroup

	wg.Add(len(rc.Canvas.Elements.Animations))

	for _, e := range rc.Canvas.Elements.Animations {
		go func(e *AnimatedElement) {
			e.renderDisposedImages()
			wg.Done()
		}(e)
	}

	wg.Wait()

	rendered := rc.createTarget()

	wg.Add(len(rendered.Image))

	for i := range rendered.Image {
		go func(i int) {
			dc := NewRenderingContext(rc.Canvas).Render(i)
			rendered.Image[i] = utils.ImageToPaletted(dc.Image())
			wg.Done()
		}(i)
	}

	wg.Wait()

	return rendered
}

func (rc *AnimatedRenderingContext) createTarget() *gif.GIF {
	origin := rc.Canvas.Elements.Animations[0].Data.GIF

	frameCount := rc.findTargetFrameCount()

	img := &gif.GIF{
		Image:           make([]*image.Paletted, frameCount),
		Delay:           make([]int, frameCount),
		Disposal:        make([]byte, frameCount),
		LoopCount:       0,
		BackgroundIndex: origin.BackgroundIndex,
		Config: image.Config{
			ColorModel: origin.Config.ColorModel,
			Width:      int(rc.Canvas.Width),
			Height:     int(rc.Canvas.Height),
		},
	}

	for i := range img.Disposal {
		img.Disposal[i] = byte(2)
	}

	for i := range img.Delay {
		img.Delay[i] = 10
	}

	return img
}

func (rc *AnimatedRenderingContext) findTargetFrameCount() int {
	frameCount := 0
	for _, e := range rc.Canvas.Elements.Animations {
		if len(e.Data.GIF.Image) > frameCount {
			frameCount = len(e.Data.GIF.Image)
		}
	}
	return frameCount
}

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
