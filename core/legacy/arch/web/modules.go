package web

import (
	"errors"
	"meme-bros/core/modules"
	"syscall/js"
)

func ModulesFromObject(object js.Value) *modules.Modules {
	return &modules.Modules{
		ReadAsset: func(path string) ([]byte, error) {
			value, err := Await(object.Call("readAsset", path))
			if err.Truthy() {
				return nil, errors.New(err.String())
			}
			data := make([]byte, value.Length())
			js.CopyBytesToGo(data, value)
			return data, nil
		},
	}
}
