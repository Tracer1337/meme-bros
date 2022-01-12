import React from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Text, Headline, Surface, IconButton, ActivityIndicator } from "react-native-paper"
import Image from "react-native-scalable-image"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"
import { useTemplates, getPreviewURI, scaleTemplateCanvas } from "./utils"
import { Documents } from "./utils/storage"

import { TemplateMeta } from "./types"
import { useSharedContext } from "@meme-bros/shared"
import { useAppContext } from "../../lib/context"

function Item({ template, onLoad }: {
    template: TemplateMeta,
    onLoad: () => void
}) {
    return (
        <Surface style={styles.item}>
            <Image
                source={{ uri: getPreviewURI(template) }}
                height={150}
                width={150}
            />
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{ template.name }</Text>
                <IconButton
                    icon="chevron-right"
                    onPress={onLoad}
                    size={32}
                />
            </View>
        </Surface>
    )
}

function TemplatesScreen({
    navigation
}: NativeStackScreenProps<RootStackParamList, "Templates">) {
    const appContext = useAppContext()
    const context = useSharedContext()
    
    const templates = useTemplates()

    const injectTemplate = async (template: TemplateMeta) => {
        const templateCanvas = await Documents.readTemplate(template.id)
        context.set({
            renderCanvas: true,
            canvas: scaleTemplateCanvas(templateCanvas)
        })
        navigation.navigate("Editor")
    }

    const renderItem = ({ item: template }: {
        item: TemplateMeta
    }) => {
        return (
            <Item
                template={template}
                onLoad={() => injectTemplate(template)}
            />
        )
    }

    return (
        <Screen>
            <FlatList
                data={templates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <Headline style={styles.headline}>
                        Templates
                        {appContext.templates.isSyncing && (
                            <ActivityIndicator animating/>
                        )}
                    </Headline>
                }
            />
        </Screen>
    )
}

const styles = StyleSheet.create({
    headline: {
        marginVertical: 48,
        textAlign: "center"
    },

    item: {
        flexDirection: "row",
        marginBottom: 16
    },

    itemContent: {
        padding: 16,
        marginBottom: 16
    },

    itemTitle: {
        fontSize: 18
    }
})

export default TemplatesScreen
