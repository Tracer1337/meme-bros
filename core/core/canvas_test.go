package core

import (
	"fmt"
	"image/gif"
	"image/png"
	"meme-bros/core/utils"
	"os"
	"testing"
	"time"
)

func TestGenerate(t *testing.T) {
	fileIn, _ := os.ReadFile("../mock.json")

	t0 := time.Now()
	output := GenerateFromJSON(string(fileIn))
	fmt.Printf("Generated in %s\n", time.Since(t0))

	if canvas := CanvasFromJSON(string(fileIn)); canvas.Animated {
		storeGIF(output)
	} else {
		storePNG(output)
	}
}

func storeGIF(dataURI string) {
	img := utils.ParseBase64GIF(dataURI)

	fileOut, err := os.Create("../animated.gif")
	utils.CatchError(err)

	gif.EncodeAll(fileOut, img)
}

func storePNG(dataURI string) {
	img := utils.ParseBase64Image(dataURI)

	fileOut, err := os.Create("../image.png")
	utils.CatchError(err)

	png.Encode(fileOut, img)
}

func TestTextFit(t *testing.T) {
	var expect float64 = 34
	output := FitText("This is my text", "Impact", "normal", 100, 100)
	if output != expect {
		t.Errorf("Result of TextFit is incorrect. Expected: %v, but got: %v", expect, output)
	}
}
