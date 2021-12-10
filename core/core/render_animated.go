package core

import (
	"image"
	"image/gif"
	"meme-bros/core/utils"
	"sync"
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
	rc.renderDisposedImages()
	rendered := rc.renderGIF()
	return rendered
}

func (rc *AnimatedRenderingContext) renderDisposedImages() {
	var wg sync.WaitGroup

	wg.Add(len(rc.Canvas.Elements.Animations))

	for _, e := range rc.Canvas.Elements.Animations {
		go func(e *AnimatedElement) {
			e.renderDisposedImages()
			wg.Done()
		}(e)
	}

	wg.Wait()
}

func (rc *AnimatedRenderingContext) renderGIF() *gif.GIF {
	rendered := rc.createTarget()

	var wg sync.WaitGroup

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
