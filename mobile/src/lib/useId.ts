import { useRef } from "react"

function useId() {
    const id = useRef(0)
    return () => id.current++
}

export default useId
