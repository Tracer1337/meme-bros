package utils

import (
	"encoding/base64"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"regexp"
	"strings"
)

func ParseBase64Image(dataURI string) image.Image {
	mimeType := GetMimeTypeFromBase64(dataURI)
	data := strings.Replace(dataURI, fmt.Sprintf("data:%s;base64,", mimeType), "", 1)

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		panic(err)
	}

	var img image.Image
	reader := strings.NewReader(string(decoded))

	switch mimeType {
	case "image/png":
		img, err = png.Decode(reader)
	case "image/jpeg":
		img, err = jpeg.Decode(reader)
	default:
		panic(fmt.Sprintf("Unsupported image format: '%s'", mimeType))
	}

	if err != nil {
		panic(err)
	}

	return img
}

func GetMimeTypeFromBase64(data string) string {
	reg := regexp.MustCompile("data:([\\w/]+);base64,")
	match := reg.FindString(data)
	return strings.Replace(
		strings.Replace(match, "data:", "", 1),
		";base64,", "", 1,
	)
}
