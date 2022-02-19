package web

import "syscall/js"

func Await(promise js.Value) (js.Value, js.Value) {
	resolveChan := make(chan js.Value)
	defer close(resolveChan)

	resolve := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		resolveChan <- args[0]
		return nil
	})
	defer resolve.Release()

	rejectChan := make(chan js.Value)
	defer close(rejectChan)

	reject := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		rejectChan <- args[0]
		return nil
	})
	defer reject.Release()

	promise.Call("then", resolve).Call("catch", reject)

	select {
	case result := <-resolveChan:
		return result, js.Undefined()
	case err := <-rejectChan:
		return js.Undefined(), err
	}
}

func NewPromise(fn func() (js.Value, js.Value)) js.Value {
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		resolve, reject := args[0], args[1]
		go func() {
			value, err := fn()
			if err.Truthy() {
				reject.Invoke(err)
			} else {
				resolve.Invoke(value)
			}
		}()
		return nil
	})
	return js.Global().Get("Promise").New(handler)
}
