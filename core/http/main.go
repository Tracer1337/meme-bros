package main

import (
	"io/ioutil"
	"meme-bros/core/core"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.SetTrustedProxies(nil)

	r.POST("/render", func(c *gin.Context) {
		buf, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			c.AbortWithStatus(400)
			return
		}
		canvas := core.RenderFromJSON(string(buf))
		c.Data(200, "", []byte(canvas))
	})

	r.Run("localhost:8000")
}
