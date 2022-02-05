package main

import (
	"meme-bros/core/arch/web"
	"meme-bros/core/core"
	"syscall/js"
)

func main() {
	js.Global().Set("render", js.FuncOf(render))
	select {}
}

func render(this js.Value, args []js.Value) interface{} {
	return web.NewPromise(func() (js.Value, js.Value) {
		json := args[0].String()
		modules := web.ModulesFromObject(args[1])
		dataURI := core.RenderFromJSON(modules, json)
		return js.ValueOf(dataURI), js.Undefined()
	})
}
