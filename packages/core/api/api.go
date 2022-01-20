package api

import "meme-bros/core/core"

func RenderFromJSON(json string) string {
	return core.RenderFromJSON(json)
}

func FitText(text string, fontFamily string, fontWeight string, width float64, height float64) float64 {
	return core.FitText(text, fontFamily, fontWeight, width, height)
}
