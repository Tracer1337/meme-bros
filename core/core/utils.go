package core

import (
	"fmt"
	"io/ioutil"
	"math"
	"strings"

	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/font"
	"golang.org/x/mobile/asset"
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

func FitText(text string, fontFamily string, fontWeight string, width float64, height float64) float64 {
	var low, high float64 = 1, height
	dc := gg.NewContext(int(width), int(height))

	fontSize := low
	for low <= high {
		mid := math.Floor((high + low) / 2)
		font := loadFont(dc, fontFamily, fontWeight, mid)
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

func loadFont(dc *gg.Context, name string, fontWeight string, fontSize float64) font.Face {
	fileName := fmt.Sprintf("fonts/%s_%s.ttf", name, fontWeight)
	file, err := asset.Open(fileName)
	if err != nil {
		panic(err)
	}
	raw, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	font, err := truetype.Parse(raw)
	if err != nil {
		panic(err)
	}
	face := truetype.NewFace(font, &truetype.Options{
		Size: float64(fontSize),
	})
	dc.SetFontFace(face)
	return face
}
