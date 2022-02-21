package core

import (
	"encoding/base64"
	"meme-bros/core/modules"
)

func RenderFromJSON(m *modules.Modules, json string) string {
	canvas := CanvasFromJSON(json)

	output := canvas.Render(m)

	encoded := base64.StdEncoding.EncodeToString(output.Bytes())

	if canvas.Animated {
		return "data:image/gif;base64," + string(encoded)
	}
	return "data:image/png;base64," + string(encoded)
}
