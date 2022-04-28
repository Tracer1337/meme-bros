import React, { useRef, useState } from "react"
import { Image } from "react-native"
import { Button, Dialog, Text } from "react-native-paper"
import { useAPI } from "@meme-bros/api-sdk"
import { Permissions, useModule, useSharedContext } from "@meme-bros/client-lib"
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

    const api = useAPI()
    
    const storage = useModule("storage")
    const social = useModule("social")

    const snackbar = useSnackbar()

    const { withPermission } = usePermissionUtils()

    const isRegistered = useRef(false)

    const [isUploading, setIsUploading] = useState(false)
    const [url, setUrl] = useState<string>()

    const registerUse = () => {
        if (!isRegistered.current) {
            isRegistered.current = true
            if (context.template) {
                api.templates.registerUse(context.template.id)
            }
            Object.values(context.stickers).forEach((filename) =>
                api.stickers.registerUse(filename)
            )
        }
    }

    const save = async () => {
        withPermission(Permissions.WRITE_EXTERNAL_STORAGE, () =>
            storage.saveImage(data.uri)
                .then(() => {
                    snackbar.open("Image saved")
                    registerUse()
                })
                .catch((error) => {
                    console.error(error)
                    snackbar.open("Could not save image")
                })
        )
    }

    const upload = () => {
        setIsUploading(true)
        api.uploads.uploadImage(data.uri)
            .then((res) => {
                setUrl(res)
                registerUse()
            })
            .catch((error) => {
                console.error(error)
                snackbar.open("Could not upload image")
            })
            .finally(() => setIsUploading(false))
    }

    const share = async () => {
        await social.share?.({ uri: data.uri })
    }

    return (
        <Dialog visible={visible} onDismiss={close}>
            <Dialog.Content>
                <Image source={data} style={{ width: "100%" }} resizeMode="contain"/>
                <Button onPress={save} style={{ width: "100%" }}>
                    Save
                </Button>
                {!url ? (
                    <Button
                        onPress={upload}
                        loading={isUploading}
                        style={{ width: "100%" }}
                    >
                        Upload To Imgur
                    </Button>
                ) : (
                    <Text>{url}</Text>
                )}
                {social.share && (
                    <Button onPress={share} style={{ width: "100%" }}>
                        Share
                    </Button>
                )}
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
