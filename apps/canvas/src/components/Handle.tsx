import { Box } from "@mui/material"
import { styled } from "@mui/system"

const Handle = styled(Box)(({ theme }) => ({
    borderColor: theme.palette.common.black,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    display: "flex",
    pointerEvents: "all",
    cursor: "pointer",
    height: 26,
}))

export default Handle
