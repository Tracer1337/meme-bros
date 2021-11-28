package main

import (
	"encoding/json"
	"meme-bros/canvas"
	"os"
)

func main() {
	file, _ := os.ReadFile("data.json")

	canvas := canvas.Canvas{}

	_ = json.Unmarshal(file, &canvas)

	buffer := canvas.Generate()

	os.WriteFile("image.png", buffer.Bytes(), os.ModeAppend)
}
