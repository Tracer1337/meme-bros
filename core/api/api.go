package api

import (
	"meme-bros/core/arch/android"
	"meme-bros/core/core"
)

func RenderFromJSON(json string) string {
	return core.RenderFromJSON(android.Modules, json)
}
