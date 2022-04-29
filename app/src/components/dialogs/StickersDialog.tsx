import { useState } from "react"
import { FlatList, LayoutChangeEvent, StyleSheet, View} from "react-native"
import {
    ActivityIndicator,
    Button,
    Dialog,
    Headline,
    Text,
    TouchableRipple
} from "react-native-paper"
import FastImage from "react-native-fast-image"
import { makeId, useModule, useSharedContext } from "@meme-bros/client-lib"
import { fetchAsDataURI } from "@meme-bros/shared"
import { AppContextValue } from "../../lib/context"

const MIN_IMAGE_WIDTH = 70
const DIALOG_PADDING = 24
const STICKER_WIDTH = 200

function Item({ sticker, onLoad, size }: {
    sticker: string,
    onLoad: () => void,
    size: number
}) {
    const { getStickerURI } = useModule("stickers")

    const margin = 1

    const width = size - margin * 2
    const height = size - margin * 2

    return (
        <View style={{ flex: 1, flexDirection: "column", margin }}>
            <TouchableRipple onPress={onLoad}>
                <FastImage
                    source={{ uri: getStickerURI(sticker) }}
                    style={{ width, height }}
                    width={width}
                    height={height}
                />
            </TouchableRipple>
        </View>
    )
}

function StickersDialog({ visible, close, appContext }: {
    visible: boolean,
    close: () => void,
    data: undefined,
    appContext: AppContextValue
}) {
    const context = useSharedContext()

    const dimensions = useModule("view").useDimensions()
    
    const { getStickerURI } = useModule("stickers")

    const { getImageSize } = useModule("storage")

    const [width, setWidth] = useState(0)

    const numColumns = Math.floor(width / MIN_IMAGE_WIDTH)

    const handleLayout = (event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width - DIALOG_PADDING * 2)
    }

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
                size={width / numColumns}
            />
        )
    }

    return (
        <Dialog visible={visible} onDismis={close}>
            <Dialog.Title>
                <Headline>Stickers</Headline>
            </Dialog.Title>
            <Dialog.Content
                onLayout={handleLayout}
                style={{ minHeight: dimensions.height * 0.6 }}
            >
                {appContext.stickers.isLoading && (
                    <ActivityIndicator animating/>
                )}
                {appContext.stickers.error && (
                    <Text>Failed to load stickers</Text>
                )}
                {width > 0 && (
                    <FlatList
                        data={appContext.stickers.list}
                        renderItem={renderItem}
                        keyExtractor={(item) => item}
                        numColumns={numColumns}
                        style={styles.list}
                    />
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

const styles = StyleSheet.create({
    list: {
        height: 500,
        flexGrow: 0
    }
})

export default StickersDialog
