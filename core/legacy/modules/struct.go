package modules

type Modules struct {
	ReadAsset func(string) ([]byte, error)
}
