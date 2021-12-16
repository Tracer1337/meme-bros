import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { DialogProps } from "../../lib/DialogHandler"
import { PickElement } from "../../types"
import { getImageStyles } from "../elements/Image"
import Switch from "../inputs/Switch"
import { useConfigDialog } from "./utils/useConfigDialog"

type Props = DialogProps<PickElement<"image">, PickElement<"image">["data"]>

function ImageConfigDialog({ open, data: element, close }: Props) {
    const { data, getBooleanFieldProps } = useConfigDialog(element)

    const ratio = element.rect.height / element.rect.width
    const width = 100
    
    return (
        <Dialog open={open} onClose={() => close(element.data)} fullWidth>
            <DialogTitle>
                <img
                    src={element.data.uri}
                    alt=""
                    draggable="false"
                    style={{
                        ...getImageStyles(element),
                        width: width + "px",
                        height: ratio * width + "px"
                    }}
                />
            </DialogTitle>

            <DialogContent>
                <Switch {...getBooleanFieldProps("Keep Aspect Ratio", "keepAspectRatio")} />
            </DialogContent>

            <DialogActions>
                <Button onClick={() => close(data)} sx={{ width: "100%" }}>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImageConfigDialog
