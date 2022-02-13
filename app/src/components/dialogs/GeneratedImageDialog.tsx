import { Permissions, useModule, useSharedContext } from "@meme-bros/client-lib"
import React, { useState } from "react"
import { Image } from "react-native"
import { Button, Dialog } from "react-native-paper"
import { usePublicAPI } from "@meme-bros/api-sdk"
import { usePermissionUtils } from "../../lib/permissions"
import { useSnackbar } from "../../lib/snackbar"

function GeneratedImageDialog({ visible, data, close }: {
    visible: boolean,
    data: {
        uri: string,
        width: number,
        height: number
    },
    close: () => void
}) {
    const context = useSharedContext()

    const api = usePublicAPI()
    
    const storage = useModule("storage")

    const snackbar = useSnackbar()

    const { withPermission } = usePermissionUtils()

    const [isRegistered, setIsRegistered] = useState(false)

    const save = async () => {
        withPermission(Permissions.WRITE_EXTERNAL_STORAGE, () =>
            storage.saveImage(data.uri)
                .then(() => {
                    snackbar.open("Image saved")
                    if (context.template && !isRegistered) {
                        setIsRegistered(true)
                        api.templates.registerUse(context.template)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    snackbar.open("Could not save image")
                })
        )
    }

    return (
        <Dialog visible={visible} onDismiss={close}>
            <Dialog.Content>
                <Image source={data} style={{ width: "100%" }} resizeMode="contain"/>
                <Button onPress={save} style={{ width: "100%" }} disabled={!storage}>
                    Save
                </Button>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={close} style={{ width: "100%" }}>
                    Close
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default GeneratedImageDialog
