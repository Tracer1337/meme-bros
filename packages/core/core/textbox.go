package core

import (
	"fmt"
	"strings"

	"github.com/Tracer1337/gg"
)

func (e *TextboxElement) GetIndex() int {
	return e.Index
}

func (e *TextboxElement) GetType() string {
	return "textbox"
}

func (e *TextboxElement) Draw(dc *gg.Context, c *Canvas, i int) {
	defer dc.Identity()

	e.Rect.ApplyRotation(dc)

	e.loadFont(dc, c)
	e.drawBackground(dc, c)
	e.drawTextOutline(dc, c)
	e.drawText(dc, c)

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

func (e *TextboxElement) drawBackground(dc *gg.Context, c *Canvas) {
	dc.SetColor(e.Data.BackgroundColor)
	dc.DrawRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height)
	dc.Fill()
}

func (e *TextboxElement) drawTextOutline(dc *gg.Context, c *Canvas) {
	s := e.Data.OutlineWidth
	dc.SetColor(e.Data.OutlineColor)
	for dy := -s; dy <= s; dy++ {
		for dx := -s; dx <= s; dx++ {
			if dx == 0 && dy == 0 {
				continue
			}
			e.drawAlignedText(dc, c, dx, dy)
		}
	}
}

func (e *TextboxElement) drawText(dc *gg.Context, c *Canvas) {
	dc.SetColor(e.Data.Color)
	e.drawAlignedText(dc, c, 0, 0)
}

func (e *TextboxElement) drawAlignedText(dc *gg.Context, c *Canvas, dx, dy float64) {
	fText := e.getFormattedText()
	p := e.Data.Padding
	x, y, ax, ay := e.resolveVerticalAlign()
	dc.DrawStringWrapped(fText, x+dx+p, y+dy, ax, ay, e.Rect.Width-p*2, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
}

func (e *TextboxElement) resolveVerticalAlign() (x, y, ax, ay float64) {
	x = e.Rect.X
	y = e.Rect.Y
	ax = 0
	ay = 0

	switch e.Data.VerticalAlign {
	case "center":
		y += e.Rect.Height / 2
		ay = 0.5
		break
	case "bottom":
		y += e.Rect.Height - e.Data.Padding
		ay = 1
		break
	case "top":
		y += e.Data.Padding
		break
	default:
		panic(fmt.Sprintf("Unknown value for vertical-align '%s'", e.Data.VerticalAlign))
	}

	return x, y, ax, ay
}

func (e *TextboxElement) loadFont(dc *gg.Context, c *Canvas) {
	fText := e.getFormattedText()
	p := e.Data.Padding
	fontSize := FitText(fText, e.Data.FontFamily, e.Data.FontWeight, e.Rect.Width-p*2, e.Rect.Height-p*2)
	loadFont(dc, e.Data.FontFamily, e.Data.FontWeight, fontSize)
}
