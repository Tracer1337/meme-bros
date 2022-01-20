import { Animated } from "react-native"
import { FirstArgument } from "tsdef"

export function withOffset<
    V extends Animated.Value | Animated.ValueXY
>(value: V, offset: FirstArgument<V["setOffset"]>) {
    value.setOffset(offset as number & { x: number, y: number })
    return value
}
