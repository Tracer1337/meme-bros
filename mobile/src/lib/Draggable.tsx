import React, { useEffect, useMemo, useRef, useState } from "react"
import { Animated, LayoutChangeEvent, PanResponder, StyleSheet } from "react-native"
import { withOffset } from "./animated"

type Rect = { width: number, height: number }

type ViewProps = React.ComponentProps<typeof Animated["View"]>

export type DraggableProps = React.PropsWithChildren<{
    style?: ViewProps["style"],
    x?: number,
    y?: number,
    clamp?: [number, number, number, number],
    disabled?: boolean,
    onDrag?: (pos: { x: number, y: number }) => void,
    onStart?: () => void,
    onEnd?: () => void,
    controlled?: boolean,
    onLayout?: ViewProps["onLayout"]
}>

function Draggable({ children, ...partialProps }: DraggableProps) {
    const props = Object.assign({
        x: 0,
        y: 0,
        disabled: false
    }, partialProps)

    const pan = useRef(withOffset(new Animated.ValueXY(), props)).current

    const handleGestureStart = () => {
        props.onStart?.()
    }
    
    const handleGestureEnd = () => {
        pan.extractOffset()
        props.onEnd?.()
    }

    const panResponder = useMemo(() =>
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
            onPanResponderGrant: handleGestureStart,
            onPanResponderRelease: handleGestureEnd,
            onPanResponderTerminate: handleGestureEnd
        }),
        [props.onStart, props.onEnd]
    )

    const [layout, setLayout] = useState<
        Record<string, Animated.Value | Animated.AnimatedDiffClamp>
    >(pan.getLayout())

    const rect = useRef<Rect>({ width: 0, height: 0 })

    useEffect(() => {
        if (!props.onDrag) {
            return
        }
        const id = pan.addListener(props.onDrag)
        return () => pan.removeListener(id)
    }, [props.onDrag])

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
        props.onLayout?.(event)
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
            style={[
                props.controlled ? {} : layout,
                styles.container,
                props.style
            ]}
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
