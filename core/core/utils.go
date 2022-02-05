package core

import (
	"fmt"
	"math"
	"meme-bros/core/modules"
	"meme-bros/core/utils"
	"strings"

	"github.com/Tracer1337/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/font"
)

const LINE_SPACING = 1

func resolveTextAlign(textAlign string) gg.Align {
	switch textAlign {
	case "center":
		return gg.AlignCenter
	case "left":
		return gg.AlignLeft
	case "right":
		return gg.AlignRight
	default:
		panic(fmt.Sprintf("Unkown value for text-align '%s'", textAlign))
	}
}

func FitText(m *modules.Modules, text string, fontFamily string, fontWeight string, width float64, height float64) float64 {
	var low, high float64 = 1, height
	dc := gg.NewContext(int(width), int(height))

	fontSize := low
	for low <= high {
		mid := math.Floor((high + low) / 2)
		font := loadFont(m, dc, fontFamily, fontWeight, mid)
		multilineText := strings.Join(dc.WordWrap(text, width), "\n")
		mWidth, mHeight := dc.MeasureMultilineString(multilineText, LINE_SPACING)
		font.Close()
		if mWidth <= width && mHeight <= height {
			fontSize = mid
			low = mid + 1
		} else {
			high = mid - 1
		}
	}

	return fontSize
}

func loadFont(m *modules.Modules, dc *gg.Context, name string, fontWeight string, fontSize float64) font.Face {
	fileName := fmt.Sprintf("fonts/%s_%s.ttf", name, fontWeight)
	raw, err := m.ReadAsset(fileName)
	utils.CatchError(err)
	font, err := truetype.Parse(raw)
	utils.CatchError(err)
	face := truetype.NewFace(font, &truetype.Options{
		Size: float64(fontSize),
	})
	dc.SetFontFace(face)
	return face
}

func stringWithDefault(i []byte, d string) string {
	s := string(i)
	if s == "" {
		return d
	}
	return s
}
