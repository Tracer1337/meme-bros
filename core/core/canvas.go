package core

import (
	"bytes"
	"image/gif"
	"meme-bros/core/modules"
)

func (c *Canvas) Render(m *modules.Modules) *bytes.Buffer {
	buffer := bytes.NewBuffer([]byte{})

	if c.Animated {
		gif.EncodeAll(buffer, NewAnimatedRenderingContext(c, m).Render())
	} else {
		NewRenderingContext(c, m).Render(0).EncodePNG(buffer)
	}

	return buffer
}
