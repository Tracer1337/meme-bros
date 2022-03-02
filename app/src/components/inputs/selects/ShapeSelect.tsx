import React from "react"
import { shapeVariants } from "@meme-bros/client-lib"
import Select from "../Select"

function ShapeSelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items"
>) {
    return (
        <Select items={shapeVariants} {...props}/>
    )
}

export default ShapeSelect
