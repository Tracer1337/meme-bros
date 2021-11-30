package canvas

import (
	"fmt"

	"github.com/fogleman/gg"
)

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
