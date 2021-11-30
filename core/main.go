package main

import (
	"image/png"
	"meme-bros/core/api"
	"meme-bros/core/utils"
	"os"
)

func main() {
	fileIn, _ := os.ReadFile("data.json")

	output := api.GenerateFromJSON(string(fileIn))

	img := utils.ParseBase64Image(output)

	fileOut, err := os.Create("image.png")
	if err != nil {
		panic(err)
	}

	png.Encode(fileOut, img)
}
