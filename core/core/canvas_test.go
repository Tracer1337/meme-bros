package core

import (
	"fmt"
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

	img := utils.ParseBase64Image(output)

	fileOut, err := os.Create("../image.png")
	if err != nil {
		panic(err)
	}

	png.Encode(fileOut, img)
}

func TestTextFit(t *testing.T) {
	var expect float64 = 34
	output := FitText("This is my text", "Impact", "normal", 100, 100)
	if output != expect {
		t.Errorf("Result of TextFit is incorrect. Expected: %v, but got: %v", expect, output)
	}
}
