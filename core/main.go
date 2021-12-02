package main

import (
	"fmt"
	"image/png"
	"meme-bros/core/api"
	"meme-bros/core/utils"
	"os"
	"time"
)

func main() {
	t0 := time.Now()
	// textfit()
	generate()
	fmt.Println(time.Since(t0))
}

func generate() {
	fileIn, _ := os.ReadFile("data.json")

	output := api.GenerateFromJSON(string(fileIn))

	img := utils.ParseBase64Image(output)

	fileOut, err := os.Create("image.png")
	if err != nil {
		panic(err)
	}

	png.Encode(fileOut, img)
}

func textfit() {
	output := api.FitText("This is my text", "Impact", "light", 100, 100)
	fmt.Printf("Font-Size: %v\n", output)
}
