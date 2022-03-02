import React from "react"
import { textAlign } from "@meme-bros/client-lib"
import Select from "./Select"

function TextAlignSelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items" | "getItemStyles"
>) {
    return (
        <Select
            items={textAlign}
            getItemTextStyles={(item) => ({ textAlign: item.value })}
            {...props}
        />
    )
}

export default TextAlignSelect
