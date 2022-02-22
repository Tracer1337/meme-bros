import React from "react"
import { FlatList, Image, StyleSheet } from "react-native"
import {
    ActivityIndicator,
    Button,
    Dialog,
    Headline,
    Text,
    TouchableRipple
} from "react-native-paper"
import { makeId, useModule, useSharedContext } from "@meme-bros/client-lib"
import { fetchAsDataURI } from "@meme-bros/shared"
import { AppContextValue } from "../../lib/context"

const STICKER_WIDTH = 200

function Item({ sticker, onLoad }: {
    sticker: string,
    onLoad: () => void
}) {
    const { getStickerURI } = useModule("stickers")

    return (
        <TouchableRipple onPress={onLoad}>
            <Image
                source={{ uri: getStickerURI(sticker) }}
                style={{ width: 150, height: 150 }}
            />
        </TouchableRipple>
    )
}

function StickersDialog({ visible, close, appContext }: {
    visible: boolean,
    close: () => void,
    data: undefined,
    appContext: AppContextValue
}) {
    const context = useSharedContext()
    
    const { getStickerURI } = useModule("stickers")
    const { getImageSize } = useModule("storage")

    const loadSticker = async (filename: string) => {
        const uri = await fetchAsDataURI(getStickerURI(filename))
        const { width, height } = await getImageSize(uri)
        const id = makeId()
        context.events.emit("element.create", {
            id,
            type: "image",
            rect: {
                width: STICKER_WIDTH,
                height: STICKER_WIDTH * (height / width)
            },
            data: { uri }
        })
        context.set({ stickers: { [id]: filename } })
        close()
    }

    const renderItem = ({ item: filename }: {
        item: string
    }) => {
        return (
            <Item
                sticker={filename}
                onLoad={() => loadSticker(filename)}
            />
        )
    }

    return (
        <Dialog visible={visible} onDismis={close}>
            <Dialog.Title>
                <Headline>Stickers</Headline>
                {appContext.sync.isLoading && (
                    <ActivityIndicator animating/>
                )}
                {appContext.sync.error && (
                    <Text>Sync Failed</Text>
                )}
            </Dialog.Title>
            <Dialog.Content>
                {appContext.stickers.isLoading && (
                    <ActivityIndicator animating/>
                )}
                {appContext.stickers.error && (
                    <Text>Failed to load stickers</Text>
                )}
                <FlatList
                    data={appContext.stickers.list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    numColumns={2}
                    style={styles.list}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={close} style={{ width: "100%" }}>
                    Close
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    list: {
        height: 500,
        flexGrow: 0
    }
})

export default StickersDialog
