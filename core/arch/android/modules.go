package android

import (
	"io/ioutil"
	"meme-bros/core/modules"

	"golang.org/x/mobile/asset"
)

var Modules = &modules.Modules{
	ReadAsset: func(path string) ([]byte, error) {
		file, err := asset.Open(path)
		if err != nil {
			return nil, err
		}
		raw, err := ioutil.ReadAll(file)
		if err != nil {
			return nil, err
		}
		return raw, nil
	},
}
