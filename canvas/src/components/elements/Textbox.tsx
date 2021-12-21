import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import * as CSS from "csstype"
import { DialogContext } from "../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../lib/events"
import { textfit } from "../../lib/textfit"
import { PickElement } from "../../types"
import { CanvasContext, ContextValue, updateElementData } from "../Context"
import makeElement, { ElementProps } from "./makeElement"
import { getTextShadow } from "../../lib/styles"
import produce from "immer"

const PADDING = 8

const justifyContentStyles: Record<string, string> = {
    "top": "flex-start",
    "center": "center",
    "bottom": "flex-end"
}

export function getTextboxDefaultData(): PickElement<"textbox">["data"] {
    return {
        text: "Enter Text...",
        fontFamily: "Impact",
        fontWeight: "normal",
        textAlign: "center",
        verticalAlign: "center",
        color: "#ffffff",
        caps: true,
        outlineWidth: 2,
        outlineColor: "#000000",
        backgroundColor: "transparent"
    }
}

function updateTextboxText(
    state: ContextValue,
    element: PickElement<"textbox">,
    text: string
) {
    return produce(state, (draft) => {
        const newElement = draft.canvas.elements.find(
            (e) => e.id === element.id
        ) as PickElement<"textbox">
        if (!newElement) {
            return
        }
        newElement.data.text = text
    })
}

export function getTextboxStyles(element: PickElement<"textbox">): CSS.Properties {
    return {
        padding: `${PADDING}px`,
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

function Textbox({ element, size, setDraggableProps }: ElementProps<"textbox">) {
    const context = useContext(CanvasContext)
    const dialogs = useContext(DialogContext)

    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    
    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        const handleFocusOut = () => {
            setIsEditing(false)
            textRef.current?.removeEventListener("focusout", handleFocusOut)
        }

        setIsEditing(true)
        requestAnimationFrame(() => textRef.current?.focus())

        textRef.current?.addEventListener("focusout", handleFocusOut)
    }

    const handleConfig = async () => {
        const data = await dialogs.open("TextboxConfigDialog", element)
        context.set(updateElementData(context, element, data))
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (!textRef.current) {
            return
        }
        const text = e.currentTarget.textContent || ""
        context.set(updateTextboxText(context, element, text))
    }

    const updateFontSize = useCallback(() => {
        if (!textRef.current) {
            return
        }
        const minSize = PADDING * 2 + 1
        const fontSize = textfit({
            width: Math.max(minSize, size.x.value),
            height: Math.max(minSize, size.y.value),
            text: element.data.text,
            styles: getTextboxStyles(element)
        })
        textRef.current.style.fontSize = fontSize + "px"
    }, [element, size])

    useEffect(() =>
        setListeners(context.events, [
            ["element.edit", consumeEvent(element.id, handleEdit)],
            ["element.config", consumeEvent(element.id, handleConfig)]
        ])
    )

    useEffect(() => {
        setDraggableProps({ disabled: isEditing })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing])

    useEffect(() => setListeners(size, [
        ["update", updateFontSize]
    ]))

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
                ...(context.interactions.focus !== element.id ? {} : {
                    border: "1px dashed gray"
                })
            }}
        >
            <div
                ref={textRef}
                contentEditable={isEditing}
                style={{ ...getTextboxStyles(element), ...{
                    userSelect: "none",
                    outline: "none",
                    resize: "none"
                } }}
                onInput={handleInput}
            />
        </div>
    )
}

export default makeElement(Textbox)
