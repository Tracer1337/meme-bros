import { useCallback, useEffect, useRef } from "react"
import * as CSS from "csstype"
import { Editor } from "@meme-bros/shared"
import { useSharedContext, useListeners } from "@meme-bros/client-lib"
import { textfit } from "../../lib/textfit"
import makeElement, { ElementProps } from "./makeElement"
import { getTextShadow } from "../../lib/styles"
import { useAnimationRegistry } from "../../lib/animation"

const justifyContentStyles: Record<string, string> = {
    "top": "flex-start",
    "center": "center",
    "bottom": "flex-end"
}

export function getTextboxStyles(element: Editor.PickElement<"textbox">): CSS.Properties {
    return {
        padding: `${element.data.padding}px`,
        whiteSpace: "pre-wrap",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        lineHeight: 1,
        color: element.data.color,
        fontFamily: element.data.fontFamily,
        fontWeight: element.data.fontWeight,
        backgroundColor: element.data.backgroundColor,
        textAlign: element.data.textAlign as CSS.Property.TextAlign,
        textTransform: element.data.caps ? "uppercase" : undefined,
        textShadow: getTextShadow(element.data.outlineWidth, element.data.outlineColor),
        justifyContent: justifyContentStyles[element.data.verticalAlign]
    }
}

function TextboxElement({ element }: ElementProps<"textbox">) {
    const context = useSharedContext()

    const size = useAnimationRegistry().getAnimationXY(
        `element.${element.id}.size`
    )

    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    const updateFontSize = useCallback(() => {
        if (!textRef.current) {
            return
        }
        const minSize = element.data.padding * 2 + 1
        const fontSize = textfit({
            width: Math.max(minSize, size.x.value),
            height: Math.max(minSize, size.y.value),
            text: element.data.text,
            styles: getTextboxStyles(element)
        })
        textRef.current.style.fontSize = fontSize + "px"
    }, [element, size])

    useListeners(size, [
        ["update", updateFontSize]
    ])

    useEffect(() => {
        if (!textRef.current) {
            return
        }
        textRef.current.textContent = element.data.text
        updateFontSize()
    }, [element.data.text, updateFontSize])

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: element.data.backgroundColor,
                ...(context.focus !== element.id ? {} : {
                    border: "1px dashed gray"
                })
            }}
        >
            <div
                ref={textRef}
                style={{
                    ...getTextboxStyles(element),
                    userSelect: "none",
                    outline: "none",
                    resize: "none"
                }}
            />
        </div>
    )
}

export default makeElement(TextboxElement)
