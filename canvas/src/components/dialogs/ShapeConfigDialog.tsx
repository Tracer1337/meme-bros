import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"
import { getShapeStyles } from "../elements/Shape"
import { colors, shapeVariants } from "../inputs/items"
import Select from "../inputs/Select"
import { useConfigDialog } from "./utils/useConfigDialog"

type Props = DialogProps<PickElement<"shape">, PickElement<"shape">["data"]>

function ShapeConfigDialog({ open, data: element, close }: Props) {
    const { data, getTextFieldProps } = useConfigDialog(element)
    
    const ratio = element.rect.height / element.rect.width
    const newWidth = 100

    return (
        <Dialog open={open} onClose={() => close(element.data)} fullWidth>
            <DialogTitle>
                <div style={{
                    ...getShapeStyles({ ...element, data }),
                    width: newWidth + "px",
                    height: ratio * newWidth + "px" 
                }}/>
            </DialogTitle>

            <DialogContent>
                <Select {...getTextFieldProps("Background Color", "backgroundColor")} options={colors} />
                <Select {...getTextFieldProps("Border Color", "borderColor")} options={colors} />
                <TextField {...getTextFieldProps("BorderWidth", "borderWidth")} type="number" />
                <Select {...getTextFieldProps("Shape", "variant")} options={shapeVariants} />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => close(data)} sx={{ width: "100%" }}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShapeConfigDialog
