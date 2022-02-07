import React from "react"
import { Image, Platform } from "react-native"
import { Button, Dialog } from "react-native-paper"
import { Gallery } from "../../lib/storage"

function GeneratedImageDialog({ visible, data, close }: {
    visible: boolean,
    data: {
        uri: string,
        width: number,
        height: number
    },
    close: () => void
}) {
    const save = async () => {
        await Gallery.saveImage(data.uri)
    }

    return (
        <Dialog visible={visible} onDismiss={close}>
            <Dialog.Content>
                <Image source={data} style={{ width: "100%" }} resizeMode="contain"/>
                <Button onPress={save} style={{ width: "100%" }}>
                    {Platform.select({ web: "Download", default: "Save" })}
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
