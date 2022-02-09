import { useModule } from "@meme-bros/client-lib"
import React from "react"
import { Image } from "react-native"
import { Button, Dialog } from "react-native-paper"

function GeneratedImageDialog({ visible, data, close }: {
    visible: boolean,
    data: {
        uri: string,
        width: number,
        height: number
    },
    close: () => void
}) {
    const storage = useModule("storage")

    const save = async () => {
        await storage.saveImage(data.uri)
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
