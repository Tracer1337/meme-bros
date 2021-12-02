package core

import (
	"encoding/base64"
)

func GenerateFromJSON(json string) string {
	canvas := CanvasFromJSON(json)

	output := canvas.Generate()

	encoded := base64.StdEncoding.EncodeToString(output.Bytes())

	return "data:image/png;base64," + string(encoded)
}
