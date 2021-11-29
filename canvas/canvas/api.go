package canvas

import (
	"bytes"
	"encoding/base64"

	"github.com/valyala/fastjson"
)

func GenerateFromJSON(jsonString string) string {
	var p fastjson.Parser
	v, err := p.Parse(jsonString)
	if err != nil {
		panic(err)
	}

	canvas := parseCanvas(v)

	outputBuffer := canvas.Generate()

	buffer := bytes.NewBuffer([]byte{})
	base64.NewEncoder(base64.StdEncoding, buffer).Write(outputBuffer.Bytes())

	return "data:image/png;base64," + buffer.String()
}
