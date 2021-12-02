package api

import (
	"encoding/base64"
	"meme-bros/core/canvas"
)

func GenerateFromJSON(json string) string {
	canvas := canvas.CanvasFromJSON(json)

	output := canvas.Generate()

	encoded := base64.StdEncoding.EncodeToString(output.Bytes())

	return "data:image/png;base64," + string(encoded)
}

func FitText(text string, fontFamily string, fontWeight string, width float64, height float64) float64 {
	return canvas.FitText(text, fontFamily, fontWeight, width, height)
}
