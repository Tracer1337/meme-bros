package utils

import (
	"encoding/base64"
	"image"
	"image/png"
	"strings"
)

func ParseBase64Image(dataURI string) image.Image {
	data := strings.Replace(dataURI, "data:image/png;base64,", "", 1)
	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		panic(err)
	}
	img, err := png.Decode(strings.NewReader(string(decoded)))
	if err != nil {
		panic(err)
	}
	return img
}
