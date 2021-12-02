package canvas

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

func (c *Canvas) drawElements(dc *gg.Context) {
	for _, e := range c.Elements.Images {
		c.drawImage(dc, e)
	}

	for _, e := range c.Elements.Textboxes {
		c.drawTextbox(dc, e)
	}
}

func (c *Canvas) drawImage(dc *gg.Context, e *ImageElement) {
	defer dc.Identity()
	img := utils.ParseBase64Image(e.Data.URI)
	bounds := img.Bounds()
	sx, sy := e.Rect.ApplyScaling(dc, float64(bounds.Max.X), float64(bounds.Max.Y))
	e.Rect.ApplyRotation(dc)
	dc.DrawImage(img, int(e.Rect.X*(1/sx)), int(e.Rect.Y*(1/sy)))
}

func (c *Canvas) drawTextbox(dc *gg.Context, e *TextboxElement) {
	defer dc.Identity()
	fontSize := FitText(e.Data.Text, e.Data.FontFamily, e.Rect.Width, e.Rect.Height)
	loadFont(dc, e.Data.FontFamily, fontSize)
	dc.SetHexColor(e.Data.Color)
	text := e.Data.Text
	if e.Data.Caps {
		text = strings.ToUpper(text)
	}
	e.Rect.ApplyRotation(dc)
	dc.DrawStringWrapped(text, e.Rect.X, e.Rect.Y, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
	dc.SetColor(color.Black)
	dc.SetLineWidth(3)
	dc.DrawRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height)
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
