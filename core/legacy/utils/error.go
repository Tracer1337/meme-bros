package utils

func CatchError(e error) {
	if e != nil {
		panic(e)
	}
}
