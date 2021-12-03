package core

import (
	"bytes"
	"image/color"
	"meme-bros/core/utils"
	"strings"

	"github.com/fogleman/gg"
)

func (c *Canvas) Generate() *bytes.Buffer {
	dc := gg.NewContext(int(c.Width), int(c.Height))
	dc.SetHexColor(c.Background)
	dc.Clear()
	c.drawElements(dc)
	buffer := bytes.NewBuffer([]byte{})
	dc.EncodePNG(buffer)
	return buffer
}

type Element interface {
	Draw(dc *gg.Context)
}

func (c *Canvas) drawElements(dc *gg.Context) {
	for _, e := range c.Elements.Images {
		e.Draw(dc, c)
	}

	for _, e := range c.Elements.Textboxes {
		e.Draw(dc, c)
	}
}

func (e *ImageElement) Draw(dc *gg.Context, c *Canvas) {
	defer dc.Identity()
	defer dc.ResetClip()

	img := utils.ParseBase64Image(e.Data.URI)
	bounds := img.Bounds()
	sx, sy := e.Rect.ApplyScaling(dc, float64(bounds.Max.X), float64(bounds.Max.Y))
	e.Rect.ApplyRotation(dc)
	dc.DrawRoundedRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height, e.Data.BorderRadius)
	dc.Clip()
	dc.DrawImage(img, int(e.Rect.X*(1/sx)), int(e.Rect.Y*(1/sy)))

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *TextboxElement) Draw(dc *gg.Context, c *Canvas) {
	defer dc.Identity()

	text := e.getFormattedText()
	fontSize := FitText(text, e.Data.FontFamily, e.Data.FontWeight, e.Rect.Width, e.Rect.Height)
	loadFont(dc, e.Data.FontFamily, e.Data.FontWeight, fontSize)
	e.Rect.ApplyRotation(dc)
	e.drawTextOutline(dc, c)
	dc.SetHexColor(e.Data.Color)
	dc.DrawStringWrapped(text, e.Rect.X, e.Rect.Y, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))

	if c.Debug {
		e.Rect.Draw(dc)
	}
}

func (e *TextboxElement) getFormattedText() string {
	text := e.Data.Text
	if e.Data.Caps {
		text = strings.ToUpper(text)
	}
	return text
}

func (e *TextboxElement) drawTextOutline(dc *gg.Context, c *Canvas) {
	text := e.getFormattedText()
	s := e.Data.OutlineWidth
	for dy := -s; dy <= s; dy++ {
		for dx := -s; dx <= s; dx++ {
			dc.SetHexColor(e.Data.OutlineColor)
			dc.DrawStringWrapped(text, e.Rect.X+dx, e.Rect.Y+dy, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
		}
	}
}

func (rect *Rect) Draw(dc *gg.Context) {
	dc.SetColor(color.Black)
	dc.SetLineWidth(3)
	dc.DrawRectangle(rect.X, rect.Y, rect.Width, rect.Height)
	dc.Stroke()
}

func (rect *Rect) ApplyRotation(dc *gg.Context) {
	x, y := rect.Center()
	dc.RotateAbout(rect.Rotation, x, y)
}

func (rect *Rect) ApplyScaling(dc *gg.Context, pWidth, pHeight float64) (sx, sy float64) {
	sx = rect.Width / float64(pWidth)
	sy = rect.Height / float64(pHeight)
	dc.Scale(sx, sy)
	return sx, sy
}

func (rect *Rect) Center() (x float64, y float64) {
	x = rect.X + rect.Width/2
	y = rect.Y + rect.Height/2
	return x, y
}
