import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { Editor } from "@meme-bros/shared"
import { DialogProps } from "../../lib/DialogHandler"
import { getShapeStyles } from "../elements/Shape"
import { colors, shapeVariants } from "../inputs/items"
import Select from "../inputs/Select"
import { useConfigDialog } from "./utils/useConfigDialog"

type Props = DialogProps<Editor.PickElement<"shape">, Editor.PickElement<"shape">["data"]>

function ShapeConfigDialog({ open, data: element, close }: Props) {
    const { data, getTextFieldProps } = useConfigDialog(element)
    
    const ratio = element.rect.height / element.rect.width
    const width = 100

    return (
        <Dialog open={open} onClose={() => close(element.data)} fullWidth>
            <DialogTitle>
                <div style={{
                    ...getShapeStyles({ ...element, data }),
                    width: width + "px",
                    height: ratio * width + "px" 
                }}/>
            </DialogTitle>

            <DialogContent>
                <Select options={colors} {...getTextFieldProps("Background Color", "backgroundColor")} />
                <Select options={colors} {...getTextFieldProps("Border Color", "borderColor")} />
                <TextField type="number" {...getTextFieldProps("BorderWidth", "borderWidth")} />
                <Select options={shapeVariants} {...getTextFieldProps("Shape", "variant")} />
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
