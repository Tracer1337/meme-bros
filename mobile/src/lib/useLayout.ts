import { useRef } from "react"
import { LayoutChangeEvent } from "react-native"

type Layout = LayoutChangeEvent["nativeEvent"]["layout"]

function useLayout(): [() => Layout | null, (event: LayoutChangeEvent) => void] {
    const layout = useRef<Layout | null>(null)
    const getLayout = () => layout.current
    const onLayout = (event: LayoutChangeEvent) => {
        layout.current = event.nativeEvent.layout
    }
    return [getLayout, onLayout]
}

export default useLayout
