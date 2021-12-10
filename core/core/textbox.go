package core

import (
	"strings"

	"github.com/fogleman/gg"
)

func (e *TextboxElement) GetIndex() int {
	return e.Index
}

func (e *TextboxElement) Draw(dc *gg.Context, c *Canvas) {
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
	fText := e.getFormattedText()
	for dy := -s; dy <= s; dy++ {
		for dx := -s; dx <= s; dx++ {
			dc.SetColor(e.Data.OutlineColor)
			dc.DrawStringWrapped(fText, e.Rect.X+dx, e.Rect.Y+dy, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
		}
	}
}

func (e *TextboxElement) drawText(dc *gg.Context, c *Canvas) {
	dc.SetColor(e.Data.Color)
	fText := e.getFormattedText()
	dc.DrawStringWrapped(fText, e.Rect.X, e.Rect.Y, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
}

func (e *TextboxElement) loadFont(dc *gg.Context, c *Canvas) {
	fText := e.getFormattedText()
	fontSize := FitText(fText, e.Data.FontFamily, e.Data.FontWeight, e.Rect.Width, e.Rect.Height)
	loadFont(dc, e.Data.FontFamily, e.Data.FontWeight, fontSize)
}
