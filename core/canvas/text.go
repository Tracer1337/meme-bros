package canvas

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

func FitText(text string, fontFamily string, width float64, height float64) float64 {
	var low, high float64 = 1, height
	dc := gg.NewContext(int(width), int(height))

	fontSize := low
	for low <= high {
		mid := math.Floor((high + low) / 2)
		font := loadFont(dc, fontFamily, mid)
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

var fonts = make(map[string]*truetype.Font)

func loadFont(dc *gg.Context, name string, fontSize float64) font.Face {
	if _, ok := fonts[name]; !ok {
		file, err := asset.Open(fmt.Sprintf("fonts/%s.ttf", name))
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
		fonts[name] = font
	}
	face := truetype.NewFace(fonts[name], &truetype.Options{
		Size: float64(fontSize),
	})
	dc.SetFontFace(face)
	return face
}