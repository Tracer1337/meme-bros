package core

import (
	"strings"

	"github.com/fogleman/gg"
)

type TextbotDrawingContext struct {
	dc    *gg.Context
	c     *Canvas
	FText string
}

func (e *TextboxElement) GetIndex() int {
	return e.Index
}

func (e *TextboxElement) Draw(dc *gg.Context, c *Canvas) {
	defer dc.Identity()

	e.Rect.ApplyRotation(dc)

	context := &TextbotDrawingContext{
		dc:    dc,
		c:     c,
		FText: e.getFormattedText(),
	}

	e.loadFont(context)
	e.drawBackground(context)
	e.drawTextOutline(context)
	e.drawText(context)

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

func (e *TextboxElement) drawBackground(c *TextbotDrawingContext) {
	c.dc.SetColor(e.Data.BackgroundColor)
	c.dc.DrawRectangle(e.Rect.X, e.Rect.Y, e.Rect.Width, e.Rect.Height)
	c.dc.Fill()
}

func (e *TextboxElement) drawTextOutline(c *TextbotDrawingContext) {
	s := e.Data.OutlineWidth
	for dy := -s; dy <= s; dy++ {
		for dx := -s; dx <= s; dx++ {
			c.dc.SetColor(e.Data.OutlineColor)
			c.dc.DrawStringWrapped(c.FText, e.Rect.X+dx, e.Rect.Y+dy, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
		}
	}
}

func (e *TextboxElement) drawText(c *TextbotDrawingContext) {
	c.dc.SetColor(e.Data.Color)
	c.dc.DrawStringWrapped(c.FText, e.Rect.X, e.Rect.Y, 0, 0, e.Rect.Width, LINE_SPACING, resolveTextAlign(e.Data.TextAlign))
}

func (e *TextboxElement) loadFont(c *TextbotDrawingContext) {
	fontSize := FitText(c.FText, e.Data.FontFamily, e.Data.FontWeight, e.Rect.Width, e.Rect.Height)
	loadFont(c.dc, e.Data.FontFamily, e.Data.FontWeight, fontSize)
}
