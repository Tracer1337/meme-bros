import { useCallback, useContext, useEffect, useRef, useState } from "react"
import * as CSS from "csstype"
import { DialogContext } from "../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../lib/events"
import { textfit } from "../../lib/textfit"
import { PickElement } from "../../types"
import { EditorContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"
import { getTextShadow } from "../../lib/styles"

export function getTextboxDefaultData(): PickElement<"textbox">["data"] {
    return {
        text: "Enter Text...",
        fontFamily: "Impact",
        fontWeight: "normal",
        textAlign: "center",
        color: "#000000",
        caps: true,
        outlineWidth: 0,
        outlineColor: "#ffffff",
        backgroundColor: "transparent"
    }
}

export function getTextboxStyles(element: PickElement<"textbox">): CSS.Properties {
    return {
        padding: "8px",
        whiteSpace: "pre-wrap",
        lineHeight: 1,
        color: element.data.color,
        fontFamily: element.data.fontFamily,
        fontWeight: element.data.fontWeight,
        backgroundColor: element.data.backgroundColor,
        textAlign: element.data.textAlign as CSS.Property.TextAlign,
        textTransform: element.data.caps ? "uppercase" : undefined,
        textShadow: getTextShadow(element.data.outlineWidth, element.data.outlineColor)
    }
}

function Textbox({ element, size, setDraggableProps }: ElementProps<"textbox">) {
    const context = useContext(EditorContext)
    const dialogs = useContext(DialogContext)

    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    
    const [text, setText] = useState(element.data.text)
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
        element.data = await dialogs.open("TextboxConfigDialog", element)
        context.set({})
    }

    const updateFontSize = useCallback(() => {
        if (!textRef.current) {
            return
        }
        const fontSize = textfit({
            width: size.x.value,
            height: size.y.value,
            text,
            styles: getTextboxStyles(element)
        })
        textRef.current.style.fontSize = fontSize + "px"
    }, [element, text, size])

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
        element.data.text = text
        textRef.current.textContent = text
        updateFontSize()
    }, [element.data, text, updateFontSize])

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
                onInput={(e) => setText(e.currentTarget.textContent || "")}
            />
        </div>
    )
}

export default makeElement(Textbox)
