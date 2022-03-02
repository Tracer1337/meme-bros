import React from "react"
import { fontFamilies } from "@meme-bros/client-lib"
import Select from "./Select"

function FontFamilySelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items" | "getItemStyles"
>) {
    return (
        <Select
            items={fontFamilies}
            getItemTextStyles={(item) => ({ fontFamily: item.value })}
            {...props}
        />
    )
}

export default FontFamilySelect
