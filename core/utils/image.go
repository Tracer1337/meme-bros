package utils

import (
	"encoding/base64"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"regexp"
	"strings"
)

func ParseBase64Image(dataURI string) image.Image {
	data := TrimBase64Prefix(dataURI)

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		panic(err)
	}

	var img image.Image
	reader := strings.NewReader(string(decoded))

	mimeType := GetMimeTypeFromBase64(dataURI)
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

func GetMimeTypeFromBase64(dataURI string) string {
	reg := regexp.MustCompile("data:([\\w/]+);base64,")
	match := reg.FindString(dataURI)
	return strings.Replace(
		strings.Replace(match, "data:", "", 1),
		";base64,", "", 1,
	)
}

func TrimBase64Prefix(dataURI string) string {
	mimeType := GetMimeTypeFromBase64(dataURI)
	return strings.Replace(dataURI, fmt.Sprintf("data:%s;base64,", mimeType), "", 1)
}

func ParseBase64GIF(dataURI string) *gif.GIF {
	data := TrimBase64Prefix(dataURI)

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		panic(err)
	}

	reader := strings.NewReader(string(decoded))
	img, err := gif.DecodeAll(reader)
	CatchError(err)

	return img
}
