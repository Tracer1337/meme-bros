package core

import (
	"encoding/base64"
)

func RenderFromJSON(json string) string {
	canvas := CanvasFromJSON(json)

	output := canvas.Render()

	encoded := base64.StdEncoding.EncodeToString(output.Bytes())

	if canvas.Animated {
		return "data:image/gif;base64," + string(encoded)
	}
	return "data:image/png;base64," + string(encoded)
}
