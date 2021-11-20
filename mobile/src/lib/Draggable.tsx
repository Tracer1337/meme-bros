import React, { useRef, useState } from "react"
import { Animated, LayoutChangeEvent, PanResponder, StyleSheet } from "react-native"

export type DraggableProps = React.PropsWithChildren<{
    x?: number,
    y?: number,
    clamp?: [number, number, number, number],
    disabled?: boolean,
    [k: string]: any
}>

type Rect = { width: number, height: number }

function createPanObject({ x, y }: { x: number, y: number }) {
    const pan = new Animated.ValueXY()
    pan.setOffset({ x, y })
    return pan
}

function Draggable({ children, ...partialProps }: DraggableProps) {
    const props = Object.assign({
        x: 0,
        y: 0,
        disabled: false
    }, partialProps)

    const pan = useRef(createPanObject(props)).current

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                {
                    dx: pan.x,
                    dy: pan.y
                }
            ], {
                useNativeDriver: false
            }),
            onPanResponderRelease: () => pan.extractOffset()
        })
    ).current

    const [layout, setLayout] = useState<
        Record<string, Animated.Value | Animated.AnimatedDiffClamp>
    >(pan.getLayout())

    const rect = useRef<Rect>({ width: 0, height: 0 })

    const hasLayoutChanged = (layout: Rect) => {
        return (
            rect.current.width !== layout.width ||
            rect.current.height !== layout.height
        )
    }

    const handleLayout = (event: LayoutChangeEvent) => {
        const { clamp } = props
        if (!clamp || !hasLayoutChanged(event.nativeEvent.layout)) {
            return
        }
        const { width, height } = event.nativeEvent.layout
        rect.current = { width, height }
        setLayout({
            left: Animated.diffClamp(pan.x, clamp[0], clamp[2] - width),
            top: Animated.diffClamp(pan.y, clamp[1], clamp[3] - height)
        })
    }

    return (
        <Animated.View
            {...(props.disabled ? {} : panResponder.panHandlers)}
            style={[layout, styles.container]}
            onLayout={handleLayout}
        >
            {children}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute"
    }
})

export default Draggable
