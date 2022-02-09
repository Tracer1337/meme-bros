import React from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Text, Surface, IconButton } from "react-native-paper"
import Image from "react-native-scalable-image"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useSharedContext, TemplateMeta, useModule } from "@meme-bros/client-lib"
import { RootStackParamList } from "../../Navigator"

function Item({ template, onLoad }: {
    template: TemplateMeta,
    onLoad: () => void
}) {
    const { getPreviewURI } = useModule("templates")

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

function TemplateList({ templates }: {
    templates: TemplateMeta[]
}) {
    const context = useSharedContext()

    const { getCanvas } = useModule("templates")

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()

    const loadTemplate = async (template: TemplateMeta) => {
        const canvas = await getCanvas(template)
        context.events.emit("template.load", { template, canvas })
        navigation.navigate("Editor")
    }

    const renderItem = ({ item: template }: {
        item: TemplateMeta
    }) => {
        return (
            <Item
                template={template}
                onLoad={() => loadTemplate(template)}
            />
        )
    }

    return (
        <FlatList
            data={templates}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
    )
}

const styles = StyleSheet.create({
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

export default TemplateList
