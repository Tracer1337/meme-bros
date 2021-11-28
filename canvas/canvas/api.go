package canvas

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
)

func GenerateFromJSON(jsonString string) string {
	canvas := Canvas{}

	_ = json.Unmarshal([]byte(jsonString), &canvas)

	outputBuffer := canvas.Generate()

	buffer := bytes.NewBuffer([]byte{})
	base64.NewEncoder(base64.StdEncoding, buffer).Write(outputBuffer.Bytes())

	return "data:image/png;base64," + buffer.String()
}
