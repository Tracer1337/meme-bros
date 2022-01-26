package core

import (
	"bytes"
	"image/gif"
)

func (c *Canvas) Render() *bytes.Buffer {
	buffer := bytes.NewBuffer([]byte{})

	if c.Animated {
		gif.EncodeAll(buffer, NewAnimatedRenderingContext(c).Render())
	} else {
		NewRenderingContext(c).Render(0).EncodePNG(buffer)
	}

	return buffer
}
