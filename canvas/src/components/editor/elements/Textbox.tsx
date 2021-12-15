import { useContext, useEffect, useRef, useState } from "react"
import { DialogContext } from "../../../lib/DialogHandler"
import { consumeEvent, setListeners } from "../../../lib/events"
import { PickElement } from "../../../types"
import { EditorContext } from "../Context"
import makeElement, { ElementProps } from "./makeElement"

export function getTextboxDefaultData(): PickElement<"textbox">["data"] {
    return {
        text: "Enter Text...",
        fontFamily: "Impact",
        fontWeight: "normal",
        textAlign: "left",
        color: "#000000",
        caps: true,
        outlineWidth: 0,
        outlineColor: "#ffffff",
        backgroundColor: "transparent"
    }
}

export function getTextStyles(element: PickElement<"textbox">) {
    return {
        fontFamily: element.data.fontFamily,
        fontWeight: element.data.fontWeight,
        color: element.data.color
    }
}

export function getTransformedText(element: PickElement<"textbox">) {
    return element.data.caps
        ? element.data.text.toUpperCase()
        : element.data.text
}

function Textbox({ element, setDraggableProps }: ElementProps<"textbox">) {
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
        element.data = await dialogs.openDialog("TextboxConfigDialog", element)
        context.set({})
    }

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

    useEffect(() => {
        if (!textRef.current) {
            return
        }
        element.data.text = text
        textRef.current.textContent = text
    }, [element.data, text])

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
                style={{ ...getTextStyles(element), ...{
                    userSelect: "none",
                    outline: "none",
                    fontSize: 24,
                    resize: "none",
                    whiteSpace: "pre-wrap",
                } }}
                onInput={(e) => setText(e.currentTarget.textContent || "")}
            />
        </div>
    )
}

export default makeElement(Textbox)
