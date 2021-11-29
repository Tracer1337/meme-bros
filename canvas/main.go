package main

import (
	"image/png"
	"meme-bros/canvas"
	"meme-bros/utils"
	"os"
)

func main() {
	fileIn, _ := os.ReadFile("data.json")

	output := canvas.GenerateFromJSON(string(fileIn))

	img := utils.ParseBase64Image(output)

	fileOut, err := os.Create("image.png")
	if err != nil {
		panic(err)
	}

	png.Encode(fileOut, img)
}
