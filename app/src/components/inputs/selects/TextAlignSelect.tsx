import React from "react"
import { textAlign } from "@meme-bros/client-lib"
import Select from "../Select"

function TextAlignSelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items"
>) {
    return (
        <Select items={textAlign} {...props}/>
    )
}

export default TextAlignSelect
