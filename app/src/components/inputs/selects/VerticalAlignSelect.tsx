import { verticalAlign } from "@meme-bros/client-lib"
import Select from "../Select"

function VerticalAlignSelect(props: Omit<
    React.ComponentProps<typeof Select>,
    "items" | "getItemStyles"
>) {
    return (
        <Select items={verticalAlign} {...props}/>
    )
}

export default VerticalAlignSelect
