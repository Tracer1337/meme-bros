package core

import (
	"image"
	"image/color"
	"image/gif"
	"image/png"
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
		Canvas:           c,
		RenderingContext: NewRenderingContext(c),
	}
}

func (rc *AnimatedRenderingContext) Render() *gif.GIF {
	botLayer, topLayer := rc.Canvas.splitLayers()

	botRendered := rc.Canvas.renderLayer(botLayer)
	topRendered := rc.Canvas.renderLayer(topLayer)

	e := rc.Canvas.Elements.Animations[0]

	e.applyDisposal(2)

	disposed := e.renderDisposedImages()

	var wg sync.WaitGroup
	wg.Add(len(e.Data.GIF.Image))

	for i, frame := range disposed {
		go func(i int, frame image.Image) {
			c := rc.newCanvas(botRendered, frame, topRendered)
			newFrame, err := png.Decode(c.Render())
			utils.CatchError(err)
			e.Data.GIF.Image[i] = utils.ImageToPaletted(newFrame)
			wg.Done()
		}(i, frame)
	}

	wg.Wait()

	e.Data.GIF.Config.Width = int(rc.Canvas.Width)
	e.Data.GIF.Config.Height = int(rc.Canvas.Height)

	return e.Data.GIF
}

func (rc *AnimatedRenderingContext) renderLayers(ds []Drawable) image.Image {
	newCanvas := *rc.Canvas
	newCanvas.Drawables = ds
	return NewRenderingContext(&newCanvas).Render().Image()
}

func (rc *AnimatedRenderingContext) newFrame() *gg.Context {
	return gg.NewContext(int(rc.Canvas.Width), int(rc.Canvas.Height))
}

func (e *AnimatedElement) applyDisposal(value int) {
	for i := range e.Data.GIF.Disposal {
		e.Data.GIF.Disposal[i] = byte(value)
	}
}

func (e *AnimatedElement) renderDisposedImages() []image.Image {
	disposed := make([]image.Image, len(e.Data.GIF.Image))
	dc := gg.NewContextForImage(e.Data.GIF.Image[0])
	for i, frame := range e.Data.GIF.Image {
		dc.DrawImage(frame, 0, 0)
		cloned := gg.NewContextForImage(dc.Image())
		cloned.DrawImage(dc.Image(), 0, 0)
		disposed[i] = cloned.Image()
	}
	return disposed
}

func (rc *AnimatedRenderingContext) newCanvas(bot image.Image, frame image.Image, top image.Image) *Canvas {
	e := rc.Canvas.Elements.Animations[0]

	canvas := *rc.Canvas

	canvas.Drawables = make([]Drawable, 3)
	canvas.Animated = false
	canvas.BackgroundColor = &color.RGBA{0, 0, 0, 0}

	rect := &Rect{0, 0, canvas.Width, canvas.Height, 0}

	canvas.Drawables[0] = &ImageElement{
		Index: 0,
		Rect:  rect,
		Data:  &ImageData{bot, 0},
	}
	canvas.Drawables[2] = &ImageElement{
		Index: 2,
		Rect:  rect,
		Data:  &ImageData{top, 0},
	}

	canvas.Drawables[1] = &ImageElement{
		Index: 1,
		Rect:  e.Rect,
		Data:  &ImageData{frame, e.Data.BorderRadius},
	}

	return &canvas
}
