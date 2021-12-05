import React from "react"
import { Animated } from "react-native"
import { PickElement } from "../../../types"
import makeElement, { ElementProps } from "./makeElement"

export const imageDefaultData: PickElement<"image">["data"] = {
    uri: "",
    borderRadius: 0
}

function Image({ element, size }: ElementProps<"image">) {
    return (
        <Animated.Image
            source={{
                uri: element.data.uri,
                width: element.rect.width,
                height: element.rect.height
            }}
            resizeMode="stretch"
            width={size.x}
            height={size.y}
        />
    )
}

export default makeElement(Image, ({ element }) => ({
    focusable: element.id !== 0,
    interactions: {
        edit: false,
        config: false
    }
}))
