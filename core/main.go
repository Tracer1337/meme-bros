package main

import (
	"meme-bros/core/core"
	"syscall/js"
)

func main() {
	wait := make(chan struct{}, 0)
	js.Global().Set("render", js.FuncOf(render))
	<-wait
}

func render(this js.Value, args []js.Value) interface{} {
	json := args[0].String()
	return core.RenderFromJSON(json)
}
