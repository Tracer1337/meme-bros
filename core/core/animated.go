package core

import (
	"fmt"
	"image"
	"image/color/palette"
	"image/gif"
	"meme-bros/core/utils"
	"sync"
	"time"

	"github.com/andybons/gogif"
	"github.com/fogleman/gg"
)

type AnimatedRenderingContext struct {
	Canvas           *Canvas
	RenderingContext *RenderingContext
}

func NewAnimatedRenderingContext(c *Canvas) *AnimatedRenderingContext {
	return &AnimatedRenderingContext{
		Canvas:           c,
		RenderingContext: NewRenderingContext(c),
	}
}

func (rc *AnimatedRenderingContext) Render() *gif.GIF {
	e := rc.Canvas.Elements.Animations[0]
	anim := utils.ParseBase64GIF(e.Data.URI)

	bottomLayer := make([]Drawable, 0)
	topLayer := make([]Drawable, 0)

	for _, d := range rc.Canvas.Drawables {
		if d.GetIndex() < e.Index {
			bottomLayer = append(bottomLayer, d)
		} else {
			topLayer = append(topLayer, d)
		}
	}

	bottomRendered := rc.renderLayers(bottomLayer)
	topRendered := rc.renderLayers(topLayer)

	for i := range anim.Disposal {
		anim.Disposal[i] = 2
	}

	disposed := make([]image.Image, len(anim.Image))
	dc := gg.NewContextForImage(anim.Image[0])

	for i, frame := range anim.Image {
		dc.DrawImage(frame, 0, 0)
		cloned := gg.NewContextForImage(dc.Image())
		cloned.DrawImage(dc.Image(), 0, 0)
		disposed[i] = cloned.Image()
	}

	var wg sync.WaitGroup
	wg.Add(len(anim.Image))

	for i, frame := range disposed {
		go func(i int, frame image.Image) {
			t0 := time.Now()

			newFrame := rc.newFrame()
			newFrame.DrawImage(bottomRendered, 0, 0)
			newFrame.DrawImage(frame, 0, 0)
			newFrame.DrawImage(topRendered, 0, 0)

			anim.Image[i] = toPaletted(newFrame.Image())

			fmt.Println(time.Since(t0))

			wg.Done()
		}(i, frame)
	}

	wg.Wait()

	anim.Config.Width = int(rc.Canvas.Width)
	anim.Config.Height = int(rc.Canvas.Height)

	return anim
}

func toPaletted(img image.Image) *image.Paletted {
	p := image.NewPaletted(img.Bounds(), palette.Plan9)
	quantizer := gogif.MedianCutQuantizer{NumColor: 64}
	quantizer.Quantize(p, img.Bounds(), img, image.Point{})
	return p
}

func (rc *AnimatedRenderingContext) renderLayers(ds []Drawable) image.Image {
	newCanvas := *rc.Canvas
	newCanvas.Drawables = ds
	return NewRenderingContext(&newCanvas).Render().Image()
}

func (rc *AnimatedRenderingContext) newFrame() *gg.Context {
	return gg.NewContext(int(rc.Canvas.Width), int(rc.Canvas.Height))
}
