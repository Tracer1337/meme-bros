import React from "react"
import { fontWeights } from "@meme-bros/client-lib"
import Select from "./Select"

function FontWeightSelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items" | "getItemStyles"
>) {
    return (
        <Select
            items={fontWeights}
            getItemTextStyles={(item) => ({ fontWeight: item.value })}
            {...props}
        />
    )
}

export default FontWeightSelect
