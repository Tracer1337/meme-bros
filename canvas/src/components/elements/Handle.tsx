import React from "react"
import { Box } from "@mui/material"

function Handle(props: React.ComponentProps<typeof Box>) {
    return (
        <Box
            {...props}
            sx={{
                borderColor: "common.black",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 1,
                backgroundColor: "common.white",
                display: "flex",
                pointerEvents: "all",
                cursor: "pointer",
                height: 26,
                ...props.sx || {}
            }}
        />
    )
}

export default Handle
