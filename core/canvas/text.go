package canvas

import (
	"fmt"
	"io/ioutil"
	"math"
	"strings"

	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/mobile/asset"
)

const LINE_SPACING = 1

func fitText(text string, fontFamily string, width float64, height float64) float64 {
	var low, high float64 = 1, 1000
	dc := gg.NewContext(int(width), int(height))

	fontSize := low
	for low <= high {
		mid := math.Floor((high + low) / 2)
		loadFont(dc, fontFamily, mid)
		multilineText := strings.Join(dc.WordWrap(text, width), "\n")
		mWidth, mHeight := dc.MeasureMultilineString(multilineText, LINE_SPACING)
		if mWidth <= width && mHeight <= height {
			fontSize = mid
			low = mid + 1
		} else {
			high = mid - 1
		}
	}

	return fontSize
}

func loadFont(dc *gg.Context, name string, fontSize float64) {
	file, err := asset.Open(fmt.Sprintf("fonts/%s.ttf", name))
	if err != nil {
		panic(err)
	}
	defer file.Close()
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
}
