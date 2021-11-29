package canvas

import (
	"bytes"
	"encoding/base64"
)

func GenerateFromJSON(json string) string {
	canvas := canvasFromJSON(json)

	output := canvas.Generate()

	encoded := bytes.NewBuffer([]byte{})
	base64.NewEncoder(base64.StdEncoding, encoded).Write(output.Bytes())

	return "data:image/png;base64," + encoded.String()
}
