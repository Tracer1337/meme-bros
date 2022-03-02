import React from "react"
import { verticalAlign } from "@meme-bros/client-lib"
import Select from "./Select"

function VerticalAlignSelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items" | "getItemStyles"
>) {
    return (
        <Select
            items={verticalAlign}
            // getItemStyles={(item) => ({ alignItems: props.value })}
            {...props}
        />
    )
}

export default VerticalAlignSelect
