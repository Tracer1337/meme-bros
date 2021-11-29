package utils

import (
	"encoding/base64"
	"image"
	"strings"
)

func ParseBase64Image(dataURI string) image.Image {
	data := strings.Replace(dataURI, "data:image/png;base64,", "", 1)
	reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(data))
	img, _, err := image.Decode(reader)
	if err != nil {
		panic(err)
	}
	return img
}
